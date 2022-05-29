const fs = require('fs');
const httpStatus = require('http-status');

const APIError = require('../errors/api-error');
const constants = require('../../config/constants');

exports.removeSingleImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err && err.code === 'ENOENT') {
      console.info('File doesn\'t exist, won\'t remove it.'); // file doens't exist
    } if (err) {
      console.error('Error occurred while trying to remove file'); // other errors, e.g. maybe we don't have enough permission
    }
    console.info('Removed image successfully');
  });
};
exports.storeSingleImage = (file, folder) => {
  // if (!files.length) { // check if single file
  const { newFilename, filepath } = file;

  // Check if the file is valid
  const isValid = isFileValid(file);

  // creates a valid name by removing spaces
  const fileName = `${newFilename}.${file.mimetype.split('/').pop()}`;
  try {
    if (!isValid) {
      throw new APIError({
        message: 'File type is not supported',
        status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
      });
    }
    // Rename the file in the directory
    // const saveToPath = `./images/category/${fileName}`;
    const saveToPath = `${constants.publicDir}/images/${folder}/${fileName}`;

    // store filename to folder
    fs.writeFileSync(saveToPath, fs.readFileSync(filepath));
  } catch (error) {
    throw new APIError({
      message: error,
      status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
    });
  }
  return `/images/${folder}/${fileName}`;
  // }
};

exports.storeMultipleImage = (files, imagesKey, folder) => {
  const imageStoredPath = [];
  Object.keys(files).forEach((key) => {
    if (key.includes(imagesKey)) { // If files contain selected key
      if (!files.length) { // check if multiple file
        const file = files[key];
        const { newFilename, filepath } = file;

        // Check if the file is valid
        const isValid = isFileValid(file);

        // creates a valid name by removing spaces
        const fileName = `${newFilename}.${file.mimetype.split('/').pop()}`;
        try {
          if (isValid) {
            // Rename the file in the directory
            const saveToPath = `${constants.publicDir}/images/${folder}/${fileName}`;

            // store filename to folder
            fs.writeFileSync(saveToPath, fs.readFileSync(filepath));
            // push result file to
            imageStoredPath.push(`/images/${folder}/${fileName}`);
          }
        } catch (error) {
          throw new APIError({
            message: error,
            status: httpStatus.UNSUPPORTED_MEDIA_TYPE,
          });
        }
      }
    }
  });
  return imageStoredPath;
};

exports.removeMultipleImage = (filePaths) => {
  filePaths.forEach((filePath) => {
    fs.unlink(`./src/public${filePath}`, (err) => {
      if (err && err.code === 'ENOENT') {
        console.info('File doesn\'t exist, won\'t remove it.'); // file doens't exist
      } else if (err) {
        console.error('Error occurred while trying to remove file'); // other errors, e.g. maybe we don't have enough permission
      } else {
        console.info('Removed image successfully');
      }
    });
  });
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

// Dependance function

const isFileValid = (file) => {
  const type = file.mimetype.split('/').pop();
  const validTypes = ['jpg', 'jpeg', 'png'];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

// How to store base64
// const base64 = req.body.icon.replace(/^data:image\/png;base64,/, '');
// const buffer = Buffer.from(base64, 'base64');
// const path = `./images/category/${Date.now()}.png`;
// fs.writeFileSync(path, buffer);
