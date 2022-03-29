const express = require("express");
const { User, validateUser, userSchema } = require("../models/user");
const _ = require('lodash')
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("No user found with given Id");
  res.send(user);
});

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(404).send("No user found");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    //  department: {
    //      _id : department._id,
    //      name : department._id
    //  }
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user,['_id','name','email']));
});


module.exports = router