const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error creating user'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error logging in'
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user profile'
    });
  }
}; 