const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/Pool"); // Change this path to wherever your database pool is!

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
    console.log("1. Passport found user:", user ? user.username : "NO USER FOUND");
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      
      // Use bcrypt to compare the typed password with the hashed password in the DB
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch(err) {
    done(err);
  }
});

// Export the configured passport object
module.exports = passport;