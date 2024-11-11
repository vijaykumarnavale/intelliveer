// models/User.js
const db = require('../config/db');  // Ensure you have configured db connection in config/db.js
const bcrypt = require('bcrypt');

const User = {
  // Create a new user with hashed password
  async createUser(email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    return result.insertId;  // Returns the ID of the newly created user
  },

  // Find a user by email
  async findUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];  // Returns the first matched user, or undefined if none
  }
};

module.exports = User;
