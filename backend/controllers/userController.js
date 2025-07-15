const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// POST /api/users/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      return res.json({
        _id: user._id, name: user.name, email: user.email,
        token: generateToken(user._id)
      });
    }
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me
exports.getMe = (req, res) => {
  res.json(req.user);
};
