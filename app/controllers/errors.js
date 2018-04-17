const AbstractController = require('.');

class ErrorsController extends AbstractController {
  initRouter() {
    this.router.get('/', () => { throw new Error('Simple error'); });
    this.router.get('/promise', async () => { throw new Error('Promise error'); });
    this.router.get('/next', (request, response, next) => next('Next error'));
  }
}

module.exports = ErrorsController;
