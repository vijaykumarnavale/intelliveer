const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

async function register(req, res) {
  const { email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create the user
    const userId = await User.createUser(email, password, role);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
}

module.exports = { register, login };
