const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/rating.controller');
const { authorize, LOGGED_USER } = require('../../middlewares/auth');
const {
  listRating,
  createRating,
  updateRating,
  deleteRating,
  respondRating,
} = require('../../validations/rating.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
// router.param('userId', controller.load);

router
  .route('/')
  .post(authorize(LOGGED_USER), validate(createRating), controller.create);
router
  .route('/respond')
  .post(authorize(LOGGED_USER), validate(respondRating), controller.respond);

router
  .route('/:ratingId')
  .patch(authorize(LOGGED_USER), validate(updateRating), controller.update)
  .delete(authorize(LOGGED_USER), validate(deleteRating), controller.remove);

router
  .route('/:storeId')
  .get(validate(listRating), controller.list);// Get rating by restaurant

module.exports = router;
