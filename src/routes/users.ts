export {};
const controller = require("../controllers/users");

module.exports = (router: any) => {
  router.route("/users/find").post(controller.find);
  router.route("/users/add").post(controller.add);
  router.route("/users/sendEmailCode").post(controller.sendEmailCode);
  router.route("/users/checkEmailCode").post(controller.checkEmailCode);
  router.route("/users/updatePassword").post(controller.updatePassword);
};
