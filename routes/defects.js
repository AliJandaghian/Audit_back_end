const express = require("express");
const { Defect, validateDefect, defectSchema } = require("../models/defect");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const defects = await Defect.find().sort({ name: 1 });
  res.send(defects);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const defects = await Defect.findById(req.params.id);
  res.send(defects);
});

router.post(
  "/",
  [auth, manager, validate(validateDefect)],
  async (req, res) => {
    let defect = await Defect.findOne({ name: req.body.name });
    if (defect) return res.status(400).send("This defect already exist");

    defect = new Defect({
      name: req.body.name,
      description: req.body.description,
    });

    await defect.save();
    res.send(defect);
  }
);

router.put("/:id", [auth, manager, validateObjectId, validate(validateDefect)], async (req, res) => {

  let defect = await Defect.findOne({ name: req.body.name });
  if (defect && parseInt(req.params.id) != parseInt(defect._id))
    return res.status(400).send("Defect already exist");

  defect = await Defect.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
    },
    { new: true }
  );
  if (!defect) return res.status(404).send("No Defect found with given id");
  res.send(defect);
});

router.delete("/:id", [auth, manager, validateObjectId], async (req, res) => {
  const defect = await Defect.findByIdAndDelete(req.params.id);
  if (!defect) return res.status(404).send("No Defect found with given ID");
  res.send(defect);
});

module.exports = router;
