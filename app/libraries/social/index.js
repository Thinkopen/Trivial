class AbstractSocial {
  async validateToken(/* userToken */) {
    throw new Error(`There must be the "validateToken" method in the ${this.constructor.name} class`);
  }

  async getMe(/* accessToken */) {
    throw new Error(`There must be the "getMe" method in the ${this.constructor.name} class`);
  }
}

module.exports = AbstractSocial;
