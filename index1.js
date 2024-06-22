const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

// Replace with your MongoDB connection string (obtain from a cloud provider or local setup)
const mongoURI = 'mongodb://your_connection_string';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use(cors());
app.use(express.json());

// Define user and movie list schemas
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MovieList'
  }]
});

const movieListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  movies: [{
    type: Object
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const User = mongoose.model('User', userSchema);
const MovieList = mongoose.model('MovieList', movieListSchema);

// Sign-up route (create new user)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign-in route (authenticate user)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate('lists');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
  }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create movie list route
app.post('/create-list', async (req, res) => {
  const { name, isPublic } = req.body;
  const userId = req.user.id;

  try {
    const newList = new MovieList({ name, isPublic, createdBy: userId });
    await newList.save();

    const user = await User.findById
