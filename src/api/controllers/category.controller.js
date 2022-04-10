const httpStatus = require('http-status');
// const { omit } = require('lodash');
const fs = require('fs');
const Category = require('../models/category.model');
const APIError = require('../errors/api-error');

/**
 * Load category and append to req.
 * @public
 */
// exports.load = async (req, res, next, id) => {
//   try {
//     const user = await Category.get(id);
//     req.locals = { user };
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// };

// /**
//  * Get user
//  * @public
//  */
// exports.get = (req, res) => res.json(req.locals.user.transform());

// /**
//  * Get logged in user info
//  * @public
//  */
// exports.loggedIn = (req, res) => res.json(req.user.transform());

// /**
//  * Create new user
//  * @public
//  */
exports.create = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    // req.send(req.body.name);
    const base64 = req.body.icon.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const path = `./images/category/${Date.now()}.png`;
    fs.writeFileSync(path, buffer);

    const savedCategory = await category.save();
    res.status(httpStatus.CREATED);
    res.json(savedCategory.transform());
  } catch (error) {
    next(error);
  }
};

// /**
//  * Replace existing user
//  * @public
//  */
// exports.replace = async (req, res, next) => {
//   try {
//     const { user } = req.locals;
//     const newUser = new User(req.body);
//     const ommitRole = user.role !== 'admin' ? 'role' : '';
//     const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

//     await user.updateOne(newUserObject, { override: true, upsert: true });
//     const savedUser = await User.findById(user._id);

//     res.json(savedUser.transform());
//   } catch (error) {
//     next(User.checkDuplicateEmail(error));
//   }
// };

// /**
//  * Update existing user
//  * @public
//  */
exports.update = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.cateId);
    if (category != null) {
      category.set(req.body);
      const savedCategory = await category.save();

      res.status(httpStatus.OK);
      res.json(savedCategory.transform());
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
 * Get category list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const categories = await Category.find(req.query);
    const transformedCategories = categories.map((category) => category.transform());
    res.json(transformedCategories);
  } catch (error) {
    next(error);
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

  // const { user } = req.locals;

  // user.remove()
  //   .then(() => res.status(httpStatus.NO_CONTENT).end())
  //   .catch((e) => next(e));
};
