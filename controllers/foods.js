const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.js");

router.get("/", async function (req, res) {
  if (req.session.user) {
    try {
      const activeUser = await UserModel.findById(req.session.user._id);
      res.render("foods/index.ejs", {
        pantry: activeUser.pantry,
      });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/", async function (req, res) {
  try {
    const activeUser = await UserModel.findById(req.session.user._id);
    activeUser.pantry.push(req.body);
    await activeUser.save();
    res.redirect(`/users/${activeUser._id}/foods`);
  } catch (err) {
    console.log(err, "<--- error in post");
    res.render("foods/new.ejs", { errorMessage: "Please Try Again." });
  }
});

router.get("/new", function (req, res) {
  res.render("foods/new.ejs");
});

router.get("/:foodId", async function (req, res) {
  try {
    const activeUser = await UserModel.findById(req.session.user._id);
    const foodDoc = activeUser.pantry.id(req.params.foodId);
    res.render("foods/show.ejs", {
      pantry: foodDoc,
    });
  } catch (err) {
    console.log(err, "<--- error");
    res.redirect("/");
  }
});

router.put("/:foodId", async function (req, res) {
  try {
    const activeUser = await UserModel.findById(req.session.user._id);
    const foodDoc = activeUser.pantry.id(req.params.foodId);
    foodDoc.set(req.body);
    await activeUser.save();
    res.redirect(`/users/${activeUser._id}/foods/${req.params.foodId}`)
  } catch (err) {
    console.log(err, "<--- error");
    res.redirect("/");
  }
});

router.get("/:foodId/edit", async function (req, res) {
  try {
    const activeUser = await UserModel.findById(req.session.user._id);
    const foodDoc = activeUser.pantry.id(req.params.foodId);
    res.render("foods/edit.ejs", {
      pantry: foodDoc,
    });
  } catch (err) {
    console.log(err, "<--- error in update");
    res.redirect("/");
  }
});

router.delete("/:foodId", async function (req, res) {
  try {
    const activeUser = await UserModel.findById(req.session.user._id);
    activeUser.pantry.id(req.params.foodId).deleteOne();
    await activeUser.save();
    res.redirect(`/users/${activeUser._id}/foods`);
  } catch (err) {
    console.log(err, "<--- error in delete");
    res.redirect("/");
  }
});

module.exports = router;
