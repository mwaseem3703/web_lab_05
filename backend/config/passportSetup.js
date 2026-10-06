const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { users } = require("./mockDB"); // Import the array

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
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
