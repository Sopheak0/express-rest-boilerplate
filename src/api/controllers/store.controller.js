const formidable = require('formidable');

const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Store = require('../models/store.model');
const User = require('../models/user.model');
const APIError = require('../errors/api-error');
const myUtils = require('../utils/myUtils');

/**
 * Get store list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const {
      page, size,
    } = req.query;

    const query = {};
    const { limit, offset } = myUtils.getPagination(page, size);

    const options = {
      sort: ({ createdAt: -1 }),
      populate: ([{ path: 'category', transform: (category) => category.transform(req) }, { path: 'owner', transform: (user) => user.transform(req) }]),
    };

    Store.paginate(query, { offset, limit, options })
      .then((data) => {
        const transformedStores = data.docs.map((store) => store.transform(req));
        res.send({
          totalItems: data.totalDocs,
          data: transformedStores,
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

// /**
//  * Create new store
//  * @public
//  */
exports.create = async (req, res, next) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
    }
    try {
      // Initial store model
      const store = new Store(fields);
      if (fields.owner) {
        const owner = await User.findById(fields.owner);
        if (!owner) {
          throw new APIError({
            message: 'Owner does not exist',
            status: httpStatus.NOT_FOUND,
          });
        } else {
          store.owner = owner.id;// store.owner = req.user.id;
        }
      }
      if (fields.isVerified) {
        store.isVerified = fields.isVerified;
      }
      if (fields.location) {
        store.location.coordinates = JSON.parse(fields.location);
      }
      if (files.logo) {
        const storedLogoUrl = myUtils.storeSingleImage(files.logo, 'storeLogo');
        store.logo = storedLogoUrl;
      }
      const urls = myUtils.storeMultipleImage(files, 'previewImages', 'previewImages');
      if (urls.length) {
        store.previewImages = urls;
      }
      if (fields.availability) {
        const availabilities = fields.availability.split(',');
        const types = [];
        availabilities.forEach((element) => {
          const avail = element.split('.');
          const type = {
            day: avail[0],
            startTime: avail[1],
            endTime: avail[2],
          };
          types.push(type);
        });
        store.availability = types;
      }

      const savedStore = await store.save();
      res.status(httpStatus.CREATED);
      res.json(savedStore.transform(req));
    } catch (error) {
      next(error);
    }
  });
};

// /**
//  * Update existing store
//  * @public
//  */
exports.update = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (store != null) {
      const form = formidable({});
      form.parse(req, async (err, fields, files) => {
        if (err) {
          next(err);
        }
        try {
          // Initial store model
          store.set(fields);
          if (fields.owner) {
            const owner = await User.findById(fields.owner);
            if (!owner) {
              throw new APIError({
                message: 'Owner does not exist',
                status: httpStatus.NOT_FOUND,
              });
            } else {
              store.owner = owner.id;// store.owner = req.user.id;
            }
          }
          if (fields.isVerified) {
            store.isVerified = fields.isVerified;
          }
          if (fields.location) {
            store.location.coordinates = JSON.parse(fields.location);
          }
          if (files.logo) {
            const storedLogoUrl = myUtils.storeSingleImage(files.logo, 'storeLogo');
            store.logo.app = storedLogoUrl;
          }
          const urls = myUtils.storeMultipleImage(files, 'previewImages', 'previewImages');
          if (urls.length) { // If store images fail then urls will be empty
            store.previewImages.push(...urls);
          }
          if (fields.removedPreviewImages) { // If have removed images
            const protocol = `${req.protocol}://${req.get('host')}`; // Ex: http://localhost:3000
            const removeUrls = fields.removedPreviewImages.split(','); // Ex: urlImage1,urlImage2
            const removeProtocolFromLink = removeUrls.map((url) => url.replace(protocol, '')); // remove protocol from urlImages
            removeProtocolFromLink.forEach(async (url) => {
              const success = await myUtils.removeSingleImage(`./src/public${url}`);
              if (success) {
                store.previewImages.pop(url);
              }
            });
          }
          if (fields.availability) {
            const availabilities = fields.availability.split(',');
            const types = [];
            availabilities.forEach((element) => {
              const avail = element.split('.');
              const type = {
                day: avail[0],
                startTime: avail[1],
                endTime: avail[2],
              };
              types.push(type);
            });
            store.availability = types;
          }
          const updatedStore = await store.save();
          res.status(httpStatus.CREATED);
          res.json(updatedStore.transform(req));
        } catch (error) {
          next(error);
        }
      });
    } else {
      throw new APIError({
        message: 'Store does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Delete store
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.storeId);
    if (store != null) {
      if (store.logo != null) {
        myUtils.removeSingleImage(`./src/public${store.logo}`);
      }
      if (store.previewImages.length) {
        myUtils.removeMultipleImage(store.previewImages);
      }
      res.status(httpStatus.OK);
      res.json({ message: 'Remove store successfully', status: httpStatus.OK });
    } else {
      throw new APIError({
        message: 'Store does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }
  } catch (error) {
    next(error);
  }
};
