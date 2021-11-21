export {};
const controller = require("../controllers/score");
const { validateToken } = require("../utils/index");

module.exports = (router: any) => {
  router.route("/score/add").post(validateToken, controller.add);
  router
    .route("/score/updateLiveScore")
    .post(validateToken, controller.updateLiveScore);
};
