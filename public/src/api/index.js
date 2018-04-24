import axios from 'axios';

export default class AbstractApi {
  // eslint-disable-next-line class-methods-use-this
  async send(url, method = 'GET', params = {}, data = {}) {
    const { data: result } = await axios({
      method,
      url,
      params,
      data,
    });

    return result;
  }
}
