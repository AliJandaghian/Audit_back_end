const express = require("express");
const { Defect, validateDefect, defectSchema } = require("../models/defect");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth,async (req, res) => {
  const defects = await Defect.find().sort({ name: 1 });
  res.send(defects);
});

router.get("/:id",[auth,validateObjectId], async (req, res) => {
  const defects = await Defect.findById(req.params.id);
  res.send(defects);
});

router.post("/", auth, async (req, res) => {
  let defect = await Defect.findOne({ name: req.body.name });
  if (defect)
    return res
      .status(400)
      .send("This defect already exist in db, use diffrent abbreviation");
  const { error } = validateDefect(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  defect = new Defect({
    name: req.body.name,
    description: req.body.description,
    createdBy: {
      name: "Ali J",
      email: "alij@fyi.com",
    },
  });

  try {
    await defect.save();
    res.send(defect);
  } catch (e) {
    for (field in e.errors) {
      res.send(e.errors[field].message);
    }
  }
});

router.put("/:id", [auth,validateObjectId], async (req, res) => {
  const { error } = validateDefect(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let defect = await Defect.findOne({ name: req.body.name });

  if (defect)
    return res
      .status(400)
      .send("This defect already exist in db, use diffrent abbreviation");

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

router.delete("/:id",[auth,validateObjectId], async (req, res) => {
  const defect = await Defect.findByIdAndDelete(req.params.id);
  if (!defect) return res.status(404).send("No Defect found with given ID");
  res.send(defect);
});

module.exports = router;
