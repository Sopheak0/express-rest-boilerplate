const Joi = require('joi');

module.exports = {

  // GET /v1/rating
  listRating: {
    params: {
      storeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST /v1/rating
  createRating: {
    body: {
      description: Joi.string().allow(null).optional(),
      rating: Joi.number().min(0).max(4),
      storeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  },

  // POST /v1/rating
  respondRating: {
    body: {
      ratingId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      respond: Joi.string(),
    },
  },

  // // PUT /v1/users/:userId
  // replaceUser: {
  //   body: {
  //     email: Joi.string().email().required(),
  //     password: Joi.string().min(6).max(128).required(),
  //     name: Joi.string().max(128),
  //     role: Joi.string().valid(User.roles),
  //   },
  //   params: {
  //     userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  //   },
  // },

  // PATCH /v1/rating/:ratingId
  updateRating: {
    body: {
      rating: Joi.number(),
      description: Joi.string().allow(null).optional(),
    },
    params: {
      ratingId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /v1/rating/:ratingId
  deleteRating: {
    params: {
      ratingId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
