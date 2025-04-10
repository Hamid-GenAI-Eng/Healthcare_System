const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../../controllers/authController');
const auth = require('../../middleware/auth');
const { validateRegister, validateLogin } = require('../../middleware/validator');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, authController.login);

// @route   GET api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', auth, authController.getCurrentUser);

// @route   GET api/auth/google
// @desc    Google OAuth authentication
// @access  Public
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Create JWT token for frontend
    const payload = {
      user: {
        id: req.user.id,
        role: req.user.role
      }
    };

    // Sign and return JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
      }
    );
  }
);

module.exports = router;