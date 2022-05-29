/* eslint-disable no-unused-vars */
const formidable = require('formidable');

const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Rating = require('../models/rating.model');
const Store = require('../models/store.model');
const APIError = require('../errors/api-error');
const myUtils = require('../utils/myUtils');

/**
 * Get category list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const {
      page, size,
    } = req.query;

    const query = {};
    query.store = req.params.storeId;
    const { limit, offset } = myUtils.getPagination(page, size);

    const options = {
      populate: [{
        path: 'user',
        select: ['firstName', 'lastName', 'picture'],
      }],
      sort: ({ createdAt: -1 }),
    };

    Rating.paginate(query, { offset, limit, options })
      .then((data) => {
        res.send({
          totalItems: data.totalDocs,
          data: data.docs,
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

// // /**
// //  * Create new rating
// //  * @public
// //  */
exports.create = async (req, res, next) => {
  const form = formidable({});
  form.parse(req, async (err, fields, _files) => {
    if (err) {
      next(err);
    }
    try {
      const rating = new Rating(fields);
      rating.user = req.user.id;
      const savedRating = await rating.save();
      res.status(httpStatus.CREATED);
      res.json(savedRating.transform());
    } catch (error) {
      next(error);
    }
  });
};

// // /**
// //  * Create respond from store
// //  * @public
// //  */
exports.respond = async (req, res, next) => {
  const form = formidable({});
  form.parse(req, async (err, fields, _files) => {
    if (err) {
      next(err);
    }
    try {
      const rating = await Rating.findById(fields.ratingId);
      if (!rating) {
        throw new APIError({
          message: 'Rating does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      const store = await Store.findById(rating.store);
      if (!store) {
        throw new APIError({
          message: 'Store does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      /* eslint eqeqeq: 0 */
      if (store.owner != req.user.id) {
        console.log(store.owner, req.user.id);
        throw new APIError({
          message: 'Unfortunately, you are not the owner of the store',
          status: httpStatus.UNAUTHORIZED,
        });
      }
      rating.respond = fields.respond;
      const savedRating = await rating.save();
      res.status(httpStatus.OK);
      res.json(savedRating.transform());
    } catch (error) {
      next(error);
    }
  });
};

// // /**
// //  * Update existing rating
// //  * @public
// //  */
exports.update = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.ratingId);
    if (rating != null) {
      const form = formidable({});
      form.parse(req, async (err, fields, _files) => {
        if (err) {
          next(err);
        }
        rating.set(fields);
        const savedRating = await rating.save();
        res.status(httpStatus.OK);
        res.json(savedRating.transform());
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

// /**
//  * Delete rating
//  * @public
//  */
exports.remove = async (req, res, next) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.ratingId);
    if (rating != null) {
      res.status(httpStatus.OK);
      res.json({ message: 'Remove rating successfully', status: httpStatus.OK });
    } else {
      throw new APIError({
        message: 'Rating does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    next(error);
  }
};
