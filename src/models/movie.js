const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  release_date: {
    type: Date
  },
  poster_url: {
    type: String,
    trim: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  average_rating: {
    type: Number,
    default: 0
  },
  total_reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for review count
movieSchema.virtual('reviewCount').get(function() {
  return this.reviews.length;
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 