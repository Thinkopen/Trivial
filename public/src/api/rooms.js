import AbstractApi from '.';

export class RoomsApi extends AbstractApi {
  async getActive() {
    return this.send('rooms/active');
  }
}

export default new RoomsApi();
