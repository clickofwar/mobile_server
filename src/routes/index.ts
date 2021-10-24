const one = require("./one");
const users = require("./users");
const score = require("./score");

module.exports = (router: any) => {
  one(router);
  users(router);
  score(router);
  return router;
};
