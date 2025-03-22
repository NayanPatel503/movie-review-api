const { validationResult } = require('express-validator');
const Movie = require('../models/movie');

exports.getAllMovies = async (req, res) => {
  try {
    console.log("getAllMovies");
    const movies = await Movie.find()
      .populate('reviews', 'rating comment user')
      .sort('-createdAt');

    res.json({
      status: 'success',
      results: movies.length,
      data: {
        movies
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching movies'
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('reviews', 'rating comment user likes_count');

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        movie
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching movie'
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        movie
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating movie'
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        movie
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating movie'
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting movie'
    });
  }
}; 