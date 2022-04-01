const express = require("express");
const { Machine, validateMachine } = require("../models/machine");
const { Department } = require("../models/department");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const manager = require("../middleware/manager");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  if (!machine) return res.status(400).send("No machine found with given ID");
  res.send(machine);
});

router.get("/", auth, async (req, res) => {
  const machines = await Machine.find();
  res.send(machines);
});

router.post(
  "/",
  [auth, manager, validate(validateMachine)],
  async (req, res) => {
    let machine = await Machine.findOne({ name: req.body.name });
    if (machine) return res.status(400).send("Machine already exist");

    const department = await Department.findById(req.body.departmentId);
    if (!department)
      return res.status(404).send("No department found with given ID");

    machine = new Machine({
      name: req.body.name,
      location: {
        _id: req.body.departmentId,
        name: department.name,
      },
    });
    await machine.save();
    res.send(machine);
  }
);

router.put(
  "/:id",
  [auth, manager, validateObjectId, validate(validateMachine)],
  async (req, res) => {
    let machine = await Machine.findOne({ name: req.body.name });
    if (machine && parseInt(req.params.id) != parseInt(machine._id))
      return res.status(400).send("Machine already exist");

    const department = await Department.findById(req.body.departmentId);
    if (!department)
      return res.status(404).send("No department found with given ID");

    machine = await Machine.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        location: {
          _id: req.body.departmentId,
          name: department.name,
        },
      },
      { new: true }
    );
    if (!machine) return res.status(404).send("No Machine found with given ID");
    res.send(machine);
  }
);

router.delete('/:id',[auth, manager, validateObjectId], async(req,res)=>{
    const machine = await Machine.findByIdAndDelete(req.params.id);
  if (!machine)
    return res.status(404).send("No machine found with given Id");
  res.send(machine)
})

module.exports = router;
