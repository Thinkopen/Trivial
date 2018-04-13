class AbstractSocial {
  constructor() {
    this.baseUrl = '';
  }

  async validateToken(/* userToken */) {
    throw new Error(`There must be the "validateToken" method in the ${this.constructor.name} class`);
  }

  async getMe(/* accessToken */) {
    throw new Error(`There must be the "getMe" method in the ${this.constructor.name} class`);
  }

  getUrl(url) {
    return `${this.baseUrl}/${url}`;
  }
}

module.exports = AbstractSocial;
