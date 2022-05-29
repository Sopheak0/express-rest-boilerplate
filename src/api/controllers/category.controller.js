const formidable = require('formidable');

const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Category = require('../models/category.model');
const APIError = require('../errors/api-error');
const myUtils = require('../utils/myUtils');

/**
 * Get category list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const {
      page, size, name,
    } = req.query;

    const query = {};
    if (name) {
      query.name = { $regex: new RegExp(name), $options: 'i' };
    }
    // if (color) {
    //   query.color = { $regex: new RegExp(color), $options: 'i' };
    // }
    const { limit, offset } = myUtils.getPagination(page, size);

    const options = {
      // populate: [{
      //   path: 'category',
      //   select: 'name'
      // }],
      sort: ({ createdAt: -1 }),
    };

    Category.paginate(query, { offset, limit, options })
      .then((data) => {
        const transformedCategories = data.docs.map((category) => category.transform(req));
        res.send({
          totalItems: data.totalDocs,
          data: transformedCategories,
          totalPages: data.totalPages,
          currentPage: data.page - 1,
        });
      }).catch((err) => {
        console.log(`${req.method} : ${req.originalUrl}, message: ${err.message}`);
        next(err);
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single category
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.cateId);
    if (category != null) {
      res.status(httpStatus.OK);
      res.json(category.transform(req));
    } else {
      throw new APIError({
        message: 'Category does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    next(error);
  }
};

// /**
//  * Create new user
//  * @public
//  */
exports.create = async (req, res, next) => {
  try {
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
      }
      // Initial category model
      const category = new Category(fields);

      if (!files.length) { // check if single file
        const storedIconUrl = myUtils.storeSingleImage(files.icon, 'category');
        category.icon = storedIconUrl;
      }

      const savedCategory = await category.save();
      res.status(httpStatus.CREATED);
      res.json(savedCategory.transform(req));
    });
  } catch (error) {
    next(error);
  }
};

// /**
//  * Update existing category
//  * @public
//  */
exports.update = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.cateId);
    if (category != null) {
      // console.log(req.body);
      const form = formidable({});
      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
        }
        category.set(fields);
        if (!files.length) { // check if single file
          const storedIconUrl = myUtils.storeSingleImage(files.icon, 'category');
          myUtils.removeSingleImage(`./src/public${category.icon}`);
          category.icon = storedIconUrl;
        }
        const savedCategory = await category.save();
        res.status(httpStatus.OK);
        res.json(savedCategory.transform(req));
      });
    } else {
      throw new APIError({
        message: 'Category does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Delete category
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.cateId);
    if (category != null) {
      if (category.icon != null) {
        myUtils.removeSingleImage(`./src/public${category.icon}`);
      }
      res.status(httpStatus.OK);
      res.json({ message: 'Remove category successfully', status: httpStatus.OK });
    } else {
      throw new APIError({
        message: 'Category does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    next(error);
  }
};
