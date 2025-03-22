const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update movie's average rating and total reviews when a review is created
reviewSchema.post('save', async function(doc) {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(doc.movie);
  
  if (movie) {
    const reviews = await mongoose.model('Review').find({ movie: doc.movie });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.average_rating = totalRating / reviews.length;
    movie.total_reviews = reviews.length;
    await movie.save();
  }
});

// Update movie's average rating and total reviews when a review is deleted
reviewSchema.post('remove', async function(doc) {
  const Movie = mongoose.model('Movie');
  const movie = await Movie.findById(doc.movie);
  
  if (movie) {
    const reviews = await mongoose.model('Review').find({ movie: doc.movie });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      movie.average_rating = totalRating / reviews.length;
    } else {
      movie.average_rating = 0;
    }
    movie.total_reviews = reviews.length;
    await movie.save();
  }
});

// Method to toggle like
reviewSchema.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
    this.likes_count += 1;
  } else {
    this.likes.splice(index, 1);
    this.likes_count -= 1;
  }
  await this.save();
  return index === -1; // Returns true if liked, false if unliked
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 