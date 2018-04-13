const fs = require('fs');
const http = require('http');
const path = require('path');
const config = require('config');
const crypto = require('crypto');
const morgan = require('morgan');
const express = require('express');
const socket = require('socket.io');
const passport = require('passport');
const bodyParser = require('body-parser');

const AbstractController = require('./controllers');

const { sync } = require('./libraries/db');
const log = require('./libraries/log');

class TrivialApp {
  constructor() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
  }

  initServer() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socket(this.server);

    this.server.on('error', error => TrivialApp.handleServerError(error));

    log.silly('Server initialized');
  }

  static handleServerError(error) {
    log.error('Server error');
    log.debug(error.message);
  }

  initMiddlewares() {
    this.app.use((request, response, next) => {
      request.requestId = crypto.randomBytes(32).toString('hex');

      next();
    });

    this.app.use(morgan(config.get('server.logFormat'), {
      skip: (req, res) => res.statusCode >= 400,
      stream: { write: message => log.server.info(message) },
    }));

    this.app.use(morgan(config.get('server.logFormat'), {
      skip: (req, res) => res.statusCode < 400,
      stream: { write: message => log.server.warn(message) },
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(passport.initialize());

    passport.serializeUser((user, callback) => {
      callback(null, user);
    });

    passport.deserializeUser((obj, callback) => {
      callback(null, obj);
    });

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    log.silly('Middlewares initialized');
  }

  importRoutesFromDirectory(controllersDir, basePath, firstImport = false) {
    const folderPath = path.join(controllersDir, basePath);

    fs
      .readdirSync(folderPath)
      .filter(filename => !firstImport || filename !== 'index.js')
      .forEach((filename) => {
        const filePath = path.join(folderPath, filename);
        const urlPath = `${basePath}/${filename.replace('.js', '')}`;

        if (fs.statSync(filePath).isDirectory()) {
          this.importRoutesFromDirectory(controllersDir, urlPath);

          return;
        }

        const controllerFile = path.join(folderPath, filename);
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Controller = require(controllerFile);

        this.app.use(urlPath, new Controller(this.io).router);
      });
  }

  initRoutes() {
    const controllersDir = path.join(__dirname, 'controllers');

    this.importRoutesFromDirectory(controllersDir, '', true);

    this.app.use(AbstractController.handle404);
    this.app.use(AbstractController.handle500);

    log.silly('Routes initialized');
  }

  async listen() {
    await sync();
    log.silly('Database synced');

    await new Promise((resolve, reject) =>
      this.server.listen(config.get('server.port'), err => (err ? reject(err) : resolve())));

    log.info(`Server listening on port ${config.get('server.port')}`);
  }

  async close() {
    await new Promise((resolve, reject) =>
      this.server.close(err => (err ? reject(err) : resolve())));
  }
}

module.exports = TrivialApp;
