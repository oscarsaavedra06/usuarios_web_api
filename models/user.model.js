const mongoose = require('mongoose');

// Create a user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
  });
  
  // Create a user model
  module.exports = mongoose.model('User', userSchema);
  