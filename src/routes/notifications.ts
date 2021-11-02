export {};
const controller = require("../controllers/notifications");
const { validateToken } = require("../utils/index");

module.exports = (router: any) => {
  router.route("/notifications/send").post(validateToken, controller.send);
};
