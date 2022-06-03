const express = require("express");
const { User, validateUser, userSchema } = require("../models/user");

const { Department } = require("../models/department");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(_.pick(user, ["_id", "name", "email", "department"]));
});

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.send(
    _.map(users, _.partialRight(_.pick, ["_id", "name", "email", "department"]))
  );
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  const department = await Department.findById(req.body.departmentId);

  if (!department)
    return res.status(400).send("No department found with given ID");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    department: {
      _id: department._id,
      name: department.name,
    },
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "department"]));
});

module.exports = router;
