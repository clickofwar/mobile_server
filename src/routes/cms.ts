export {};
const controller = require("../controllers/cms");

module.exports = (router: any) => {
  router.route("/cms/update").post(controller.add);
};
