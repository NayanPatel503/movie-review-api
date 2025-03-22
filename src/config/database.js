const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Create default admin user if it doesn't exist
    await createDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const User = require('../models/user');
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      await User.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Admin User',
        role: 'admin'
      });
      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = connectDB; 