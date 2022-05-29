const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/store.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
  // listCategory,
  createStore,
  // replaceUser,
  updateStore,
  deleteStore,
} = require('../../validations/store.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
// router.param('userId', controller.load);

router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), validate(createStore), controller.create);

router
  .route('/:storeId')
  // .get(controller.get)
  .patch(authorize(ADMIN), validate(updateStore), controller.update)
  .delete(authorize(ADMIN), validate(deleteStore), controller.remove);
module.exports = router;
