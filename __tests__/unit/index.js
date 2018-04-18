const App = require('../../app');

const log = require('../../app/libraries/log');

describe('Application', () => {
  let spyError;
  let spyDebug;

  beforeEach(() => {
    spyError = jest.spyOn(log, 'error');
    spyDebug = jest.spyOn(log, 'debug');
  });

  afterEach(() => {
    spyError.mockReset();
    spyError.mockRestore();

    spyDebug.mockReset();
    spyDebug.mockRestore();
  });

  test('it can listen on the same port with two server instances', async () => {
    const app1 = new App();
    const app2 = new App();

    const port = 12345;

    await expect(app1.listen({ server: { port } })).resolves.not.toBeDefined();
    await expect(app2.listen({ server: { port } })).rejects.toThrow(`listen EADDRINUSE :::${port}`);

    expect(spyError).toHaveBeenCalledWith('Server error');
    expect(spyDebug).toHaveBeenCalled();

    await app1.close();

    await expect(app2.close()).rejects.toThrow('Not running');
  });
});
