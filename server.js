const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");

const authController = require("./controllers/auth.js");
const foodController = require("./controllers/foods.js");
const usersController = require("./controllers/users.js");

const passUserToView = require("./middleware/pass-user-to-view.js");
const isLoggedIn = require("./middleware/isLoggedIn.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

// Landing page
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/foods`);
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", authController);
app.use(isLoggedIn);
app.use("/users/:userId/foods", foodController);
app.use("/users", usersController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
