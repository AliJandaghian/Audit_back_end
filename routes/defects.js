const express = require("express");
const { Defect, validateDefect, defectSchema } = require("../models/defect");

const router = express.Router();

router.get("/", async (req, res) => {
  const defects = await Defect.find().sort({ name: 1 });
  res.send(defects);
});

router.get("/:id", async (req, res) => {
  const defects = await Defect.findById(req.params.id);
  res.send(defects);
});

router.post("/"),
  async (req, res) => {
    const defect = Defect.find((d) => (d.name = req.body.name));
    if (defect)
      return res
        .status(400)
        .send("This defect already exist in db, use diffrent abbreviation");
    const {error} = validateDefect(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    defect = new Defect({
        name : req.body.name,
        description : req.body.description,
        createdBy: {
            name: "Ali J",
            email:"alij@fyi.com"
        }
    })

    defect.save()
    res.send(defect)
  };
