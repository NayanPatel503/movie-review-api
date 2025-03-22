const express = require('express');
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation middleware
const signupValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').trim().notEmpty().withMessage('Name is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router; 