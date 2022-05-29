const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/category.controller');
const { authorize, ADMIN } = require('../../middlewares/auth');
const {
  // listCategory,
  createCategory,
  // replaceUser,
  updateCategory,
  deleteCategory,
} = require('../../validations/category.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
// router.param('userId', controller.load);

router
  .route('/')
  .get(controller.list)
  .post(authorize(ADMIN), validate(createCategory), controller.create);

router
  .route('/:cateId')
  .get(controller.get)
  .patch(authorize(ADMIN), validate(updateCategory), controller.update)
  .delete(authorize(ADMIN), validate(deleteCategory), controller.remove);
module.exports = router;
