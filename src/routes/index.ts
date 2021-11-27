const one = require("./one");
const users = require("./users");
const score = require("./score");
const notifications = require("./notifications");
const cms = require("./cms");

module.exports = (router: any) => {
  one(router);
  users(router);
  score(router);
  notifications(router);
  cms(router);
  return router;
};
