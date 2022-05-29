const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    required: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

categorySchema.plugin(mongoosePaginate);

/**
 * Methods
 */
categorySchema.method({
  transform(req) {
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    const transformed = {};
    const fields = ['id', 'name', 'icon', 'color'];

    fields.forEach((field) => {
      if (field === 'icon') {
        transformed[field] = `${fullUrl}${this[field]}`;
      } else {
        transformed[field] = this[field];
      }
    });

    return transformed;
  },
});

/**
 * @typedef Category
 */
module.exports = mongoose.model('Category', categorySchema);
