const fs = require('fs');
const httpStatus = require('http-status');

const APIError = require('../errors/api-error');
const constants = require('../../config/constants');

exports.removeSingleImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err && err.code === 'ENOENT') {
      console.info('File doesn\'t exist, won\'t remove it.'); // file doens't exist
    } else if (err) {
      console.error('Error occurred while trying to remove file'); // other errors, e.g. maybe we don't have enough permission
    } else {
      console.info('Removed image successfully');
    }
  });
};
exports.storeSingleImage = (file, folder) => {
  // if (!files.length) { // check if single file
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
  const saveToPath = `${constants.publicDir}/images/${folder}/${fileName}`;
  try {
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

// Dependance function

const isFileValid = (file) => {
  const type = file.mimetype.split('/').pop();
  const validTypes = ['jpg', 'jpeg', 'png'];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};
