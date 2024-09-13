const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

router.get("/", async function (req, res) {
  try {
    const allUsers = await UserModel.find({});
    res.render("users/index.ejs", {
      users: allUsers,
    });
  } catch (err) {
    console.log(err, "<--- error fetching users");
    res.redirect("/");
  }
});

router.get("/:id", async function (req, res) {
  try {
    const user = await UserModel.findById(req.params.id);
    res.render("users/show.ejs", {
      user: user,
      pantry: user.pantry,
    });
  } catch (err) {
    console.log(err, "<--- error fetching user pantry");
    res.redirect("/users");
  }
});

module.exports = router;
