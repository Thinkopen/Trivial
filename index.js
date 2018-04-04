const TrivialApp = require('./app');

const log = require('./app/libraries/log');

const app = new TrivialApp();

app.listen()
  .catch((error) => {
    log.error('Error while starting the application');
    log.debug(error);
  });
