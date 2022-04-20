const formidable = require('formidable');

const httpStatus = require('http-status');
// const { omit } = require('lodash');
const fs = require('fs');
const Category = require('../models/category.model');
const APIError = require('../errors/api-error');
const constants = require('../../config/constants');
const myUtils = require('../utils/myUtils');
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

// How to store base64
// const base64 = req.body.icon.replace(/^data:image\/png;base64,/, '');
// const buffer = Buffer.from(base64, 'base64');
// const path = `./images/category/${Date.now()}.png`;
// fs.writeFileSync(path, buffer);

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
        const file = files.icon;
        const { newFilename, filepath } = file;

        // Check if the file is valid
        const isValid = isFileValid(file);

        // creates a valid name by removing spaces
        const fileName = `${newFilename}.${file.mimetype.split('/').pop()}`;
        if (!isValid) {
          throw new APIError({
            message: 'File type is not supported',
            status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
          });
        }
        // Rename the file in the directory
        // const saveToPath = `./images/category/${fileName}`;
        const saveToPath = `${constants.publicDir}/images/category/${fileName}`;
        try {
          // store filename to folder
          fs.writeFileSync(saveToPath, fs.readFileSync(filepath));
        } catch (error) {
          throw new APIError({
            message: error,
            status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
          });
        }
        category.icon = `/images/category/${fileName}`;
      }

      const savedCategory = await category.save();
      res.status(httpStatus.CREATED);
      res.json(savedCategory.transform(req));
    });
  } catch (error) {
    next(error);
  }
};

const isFileValid = (file) => {
  const type = file.mimetype.split('/').pop();
  const validTypes = ['jpg', 'jpeg', 'png'];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
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
          const file = files.icon;
          const { newFilename, filepath } = file;

          // Check if the file is valid
          const isValid = isFileValid(file);

          // creates a valid name by removing spaces
          const fileName = `${newFilename}.${file.mimetype.split('/').pop()}`;
          if (!isValid) {
            throw new APIError({
              message: 'File type is not supported',
              status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
            });
          }
          // Rename the file in the directory
          // const saveToPath = `./images/category/${fileName}`;
          const saveToPath = `${constants.publicDir}/images/category/${fileName}`;
          try {
            // store filename to folder
            fs.writeFileSync(saveToPath, fs.readFileSync(filepath));
          } catch (error) {
            throw new APIError({
              message: error,
              status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
            });
          }
          myUtils.removeSingleImage(`./src/public${category.icon}`);
          category.icon = `/images/category/${fileName}`;
        }

        const savedCategory = await category.save();
        res.status(httpStatus.OK);
        res.json(savedCategory.transform(req));
      });

      // if (req.body.icon != null){

      // }
      // const omitCategoryIcon = omit(category, ['icon']);
      // const savedCategory = await omitCategoryIcon.save();

      // res.status(httpStatus.OK).send({ status: 'ok' });
      // res.json(savedCategory.transform(req));
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
    const transformedCategories = categories.map((category) => category.transform(req));
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

  // const { user } = req.locals;

  // user.remove()
  //   .then(() => res.status(httpStatus.NO_CONTENT).end())
  //   .catch((e) => next(e));
};
