const express = require("express");
const { Defect, validatDefect, defectSchema } = require("../models/defect");
const debug = require('debug')('app:db')


const router = express.Router();

router.get("/", async (req, res) => {

  const defects = await Defect.find().sort({ name: 1 });
  res.send(defects);
});

router.get("/:id", async (req, res) => {
  const defects = await Defect.findById(req.params.id);
  res.send(defects);
});

router.post("/",
  async (req, res) => {

    let defect = await Defect.findOne({name : req.body.name});
    if (defect)
      return res
        .status(400)
        .send("This defect already exist in db, use diffrent abbreviation");
    const {error} = validatDefect(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    defect = new Defect({
        name : req.body.name,
        description : req.body.description,
        createdBy: {
            name: "Ali J",
            email:"alij@fyi.com"
        }
    })
  
    try{
        await defect.save()
        res.send(defect)
    }
   catch(e){
        for (field in e.errors){
          res.send(e.errors[field].message)
        }
   }
  });

module.exports = router