const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    required: true,
  },
  address: {
    type: [String],
  },
  latLng: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    trim: true,
    lowercase: true,
  },
  picture: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  services: {
    facebook: String,
    google: String,
  },
}, {
  timestamps: true,
});

/**
 * @typedef Store
 */
module.exports = mongoose.model('Store', storeSchema);
