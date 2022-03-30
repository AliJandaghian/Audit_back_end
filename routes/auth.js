const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

router.post("/", async (req, res) => {
    const {error} = validate(req.body)
    if (error ) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password is incorrect");

  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return res.status(400).send("Email or Password is incorrect");

  const token = user.generateAuthToken();
  res.send(token);
});


function validate(user) {
    
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
   return schema.validate(user)
}
module.exports = router