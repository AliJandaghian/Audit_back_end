const express = require("express");
const { Department, validatDepartment } = require("../models/department");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.send(departments);
});

router.get("/:id", auth, async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department)
    return res.status(404).send("No department found with given Id");
  res.send(department);
});

router.post(
  "/",
  [auth, admin, validate(validatDepartment)],
  async (req, res) => {
    let department = await Department.find({ name: req.body.name });
    if (!department) return res.status(400).send("Department already exist");

    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(404).send("No manager found with given ID");
    if (!manager.isManager)
      return res
        .status(400)
        .send("Manager roll has not been set for this user ID");

    department = new Department({
      name: req.body.name,
      manager: req.body.managerId,
    });

    await department.save();
    res.send(department);
  }
);

router.put(
  "/:id",
  [auth, admin, validate(validatDepartment)],
  async (req, res) => {
    const manager = User.findById(req.body.managerId);
    if (!manager) return res.status(404).send("No manager found with given ID");
    if (!manager.isManager)
      return res
        .status(400)
        .send("Manager roll has not been set for this user ID");

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        manager: req.body.managerId,
      },
      { new: true }
    );

    if (!department)
      return res.status(404).send("No Department found with given id");
    res.send(department);
  }
);

module.exports = router;
