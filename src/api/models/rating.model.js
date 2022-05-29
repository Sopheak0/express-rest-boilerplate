const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    length: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },
  description: {
    type: String,
  },
  store: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Store',
    required: true,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  respond: String,
}, {
  timestamps: true,
});

ratingSchema.plugin(mongoosePaginate);

/**
 * Methods
 */
ratingSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'rating', 'description', 'store', 'user', 'respond', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * @typedef Rating
 */
module.exports = mongoose.model('Rating', ratingSchema);
