const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const movieController = require('../controllers/movieController');

const router = express.Router();

// Validation middleware
const movieValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('release_date').optional().isDate().withMessage('Invalid release date'),
  body('poster_url').optional().isURL().withMessage('Invalid poster URL')
];

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovie);

// Protected routes (admin only)
router.post('/', adminAuth, movieValidation, movieController.createMovie);
router.put('/:id', adminAuth, movieValidation, movieController.updateMovie);
router.delete('/:id', adminAuth, movieController.deleteMovie);

module.exports = router; 