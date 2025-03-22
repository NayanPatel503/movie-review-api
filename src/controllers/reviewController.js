const { validationResult } = require('express-validator');
const Review = require('../models/review');
const Movie = require('../models/movie');

exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { movieId } = req.params;
    const { rating, comment } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movieId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this movie'
      });
    }

    // Create review
    const review = await Review.create({
      movie: movieId,
      user: req.user._id,
      rating,
      comment
    });

    // Add review to movie's reviews array
    movie.reviews.push(review._id);
    await movie.save();

    res.status(201).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating review'
    });
  }
};

exports.getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching reviews'
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found or unauthorized'
      });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;
    await review.save();

    res.json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating review'
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found or unauthorized'
      });
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting review'
    });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.toggleLike(req.user._id);

    res.json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error toggling like'
    });
  }
}; 