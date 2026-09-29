require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;
const indexRouter = require("./routes/indexRouters")
const passport = require("./config/passport")
const session= require("express-session")
const pgsession= require("connect-pg-simple")(session)
const Pool =require("./db/Pool")



app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.use(session({
  store: new pgsession({
    pool: Pool,
    tableName: 'session' // This requires you to create a "session" table in your database first!
  }),
  secret: process.env.SESSION_SECRET || "cats", // Better to put this in your .env
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use("/",indexRouter);


app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});
