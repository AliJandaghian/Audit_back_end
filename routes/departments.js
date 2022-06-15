const express = require("express");
const { Department, validateDepartment } = require("../models/department");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/", async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.send(departments);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department)
    return res.status(404).send("No department found with given Id");
  res.send(department);
});

router.post(
  "/",
  [auth, admin, validate(validateDepartment)],
  async (req, res) => {
    let department = await Department.findOne({ name: req.body.name });
    if (department) return res.status(400).send("Department already exist");

    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(404).send("No manager found with given ID");
    if (!manager.isManager)
      return res
        .status(400)
        .send("Manager roll has not been set for this user ID");

    department = new Department({
      name: req.body.name,
      manager: { _id: req.body.managerId, name: manager.name },
    });

    await department.save();
    res.send(department);
  }
);

router.put(
  "/:id",
  [auth, admin, validateObjectId, validate(validateDepartment)],
  async (req, res) => {
    let department = await Department.findOne({ name: req.body.name });
    if (department && department._id != req.params.id)
      return res.status(400).send("Department already exist");

    const manager = await User.findById(req.body.managerId);
    if (!manager) return res.status(404).send("No manager found with given ID");
    if (!manager.isManager)
      return res
        .status(400)
        .send("Manager roll has not been set for this manager ID");

    department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        manager: { _id: req.body.managerId, name: manager.name },
      },
      { new: true }
    );

    if (!department)
      return res.status(404).send("No Department found with given id");
    res.send(department);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department)
    return res.status(404).send("No department found with given Id");
  res.send(department);
});

module.exports = router;
