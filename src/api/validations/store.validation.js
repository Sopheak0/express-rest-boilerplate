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

  // POST /v1/store
  createStore: {
    body: {
      name: Joi.string(),
      address: Joi.string().allow(null).optional(),
      // latLng: Joi.string().allow(null).optional(),
      email: Joi.string(),
      logo: Joi.string(),
      owner: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null).optional(),
      previewImages: Joi.string().allow(null).optional(),
      phone: Joi.string().allow(null).optional(),
      website: Joi.string().allow(null).optional(),
      description: Joi.string().allow(null).optional(),
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
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
  updateStore: {
    body: {
      name: Joi.string().allow(null).optional(),
      address: Joi.string().allow(null).optional(),
      // latLng: Joi.string().allow(null).optional(),
      email: Joi.string().allow(null).optional(),
      logo: Joi.string().allow(null).optional(),
      owner: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null).optional(),
      previewImages: Joi.string().allow(null).optional(),
      phone: Joi.string().allow(null).optional(),
      website: Joi.string().allow(null).optional(),
      description: Joi.string().allow(null).optional(),
      category: Joi.string().regex(/^[a-fA-F0-9]{24}$/).allow(null).optional(),
    },
    params: {
      storeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // DELETE /v1/category/:cateId
  deleteStore: {
    params: {
      storeId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
