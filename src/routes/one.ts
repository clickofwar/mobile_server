const controller = require('../controllers/one');


module.exports = (router: any) => {
  router.route('/hello')
    .get(controller.add)
};
