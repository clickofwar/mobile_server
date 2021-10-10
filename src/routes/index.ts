const one = require("./one");
const users = require("./users");

module.exports = (router: any) => {
  one(router);
  users(router);
  return router;
};
