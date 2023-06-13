const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const User= require("./models/user.model.js")
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(cors())
// Connect to MongoDB 
mongoose.connect('mongodb://root:rootpassword@localhost:27017/?authMechanism=DEFAULT', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get a user by ID
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
console.log(userId)
  try {
    if(!mongoose.Types.ObjectId.isValid(userId)){
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const user = await User.findById(userId.toString());

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' + error.message });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = new User({ name, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  try {
    if(!mongoose.Types.ObjectId.isValid(userId)){
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    if(!mongoose.Types.ObjectId.isValid(userId)){
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3001, () => {
  // console.log('Server is running on port 3001');
});

module.exports = app;
