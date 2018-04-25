export const createSocketConstants = constants => constants.reduce((result, msg) => Object.assign(result, { [msg]: msg }), {});
