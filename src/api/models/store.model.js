const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
    required: false,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: false,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    trim: true,
    lowercase: true,
    required: false,
  },
  logo: {
    type: String,
    trim: true,
    required: true,
  },
  previewImages: {
    type: [String],
    required: false,
  },
  phone: {
    type: String,
    trim: true,
    required: false,
  },
  website: {
    type: String,
    trim: true,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  },
  availability: {
    type: [{
      day: String,
      startTime: String,
      endTime: String,
    }],
    required: false,
  },
}, {
  timestamps: true,
});

storeSchema.plugin(mongoosePaginate);

/**
 * Methods
 */
storeSchema.method({
  transform(req) {
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    const transformed = {};
    const fields = ['id', 'name', 'address', 'location', 'owner', 'email', 'logo', 'previewImages', 'phone', 'website', 'description', 'isVerified', 'category', 'availability'];

    fields.forEach((field) => {
      if (field === 'logo') {
        transformed[field] = `${fullUrl}${this[field]}`;
      } else if (field === 'previewImages') {
        const imgUrls = [];
        Object.values(this[field]).forEach((val) => {
          imgUrls.push(`${fullUrl}${val}`);
        });
        transformed[field] = imgUrls;
      } else {
        transformed[field] = this[field];
      }
    });
    return transformed;
  },
});

/**
 * @typedef Store
 */
module.exports = mongoose.model('Store', storeSchema);
