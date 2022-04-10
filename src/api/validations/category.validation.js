const Joi = require('joi');

module.exports = {

  // GET /v1/users
  // listCategory: {
  //   query: {
  //     page: Joi.number().min(1),
  //     perPage: Joi.number().min(1).max(100),
  //     name: Joi.string(),
  //     email: Joi.string(),
  //     role: Joi.string().valid(User.roles),
  //   },
  // },

  // POST /v1/category
  createCategory: {
    body: {
      name: Joi.string().required(),
      // icon: Joi.string().min(6).max(128).required(),
      color: Joi.string(),
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

  // PATCH /v1/category/:cateId
  updateCategory: {
    body: {
      name: Joi.string(),
      icon: Joi.string().allow(null).optional(),
      color: Joi.string().max(20),
    },
    params: {
      cateId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /v1/category/:cateId
  deleteCategory: {
    params: {
      cateId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
