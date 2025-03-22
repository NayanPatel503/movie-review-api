const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Validation middleware
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ min: 10 })
    .withMessage('Comment must be at least 10 characters long')
];

// Public routes
router.get('/movie/:movieId', reviewController.getMovieReviews);

// Protected routes
router.post('/movie/:movieId', auth, reviewValidation, reviewController.createReview);
router.put('/:id', auth, reviewValidation, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);
router.post('/:id/like', auth, reviewController.toggleLike);

module.exports = router; 