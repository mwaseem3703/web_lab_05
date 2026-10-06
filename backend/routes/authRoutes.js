const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  refresh,
  logout,
  googleCallback,
} = require("../controllers/authController");

const router = express.Router();

// Local Auth
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Google OAuth 2.0
// Route to trigger the Google login screen
// Route to trigger the Google login screen
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"], // <-- THIS IS THE MISSING PARAMETER
    session: false,
  }),
);

// Route Google redirects to after login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  googleCallback,
);

module.exports = router;
