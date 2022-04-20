const path = require('path');

// parent directory = path.normalize(`${__dirname}/..`)
module.exports = {
  publicDir: path.join(path.normalize(`${__dirname}/..`), '/public'),
};
