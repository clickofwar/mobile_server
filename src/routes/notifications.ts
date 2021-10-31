export {};
const controller = require("../controllers/notifications");

module.exports = (router: any) => {
  router.route("/notifications/send").post(controller.send);
};
