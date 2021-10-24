export {};
const controller = require("../controllers/score");

module.exports = (router: any) => {
  router.route("/score/add").post(controller.add);
};
