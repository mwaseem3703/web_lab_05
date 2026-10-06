const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { users } = require("./mockDB"); // Import the array

passport.use(
  new GoogleStrategy(
    {
      // Added fallbacks so the server never crashes if .env is missing
      clientID: process.env.GOOGLE_CLIENT_ID || "pending",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "pending",
      // FIXED: Point this to your live Render URL
      callbackURL:
        "https://web-lab-05-ur6q.onrender.com/api/v1/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails[0].value;

        let user = users.find((u) => u.email === email);

        if (!user) {
          user = {
            id: Date.now().toString(),
            email: email,
            googleId: profile.id,
            role: "Employee",
          };
          users.push(user);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
