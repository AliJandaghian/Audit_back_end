const mongoose = require("mongoose");
const Joi = require("joi");

const defectSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return v && v.length === 2;
      },
      message: "Defect Name must be 2 charecters long",
    },
    unique: true,
    uppercase: true,
    required: true,
  },
  description: {
    type: String,
    maxlength: 25,
  },
});

const Defect = mongoose.model("defect", defectSchema);

function validateDefect(defect) {
  const schema = Joi.object({
    name: Joi.string().uppercase().length(2).required(),
    description: Joi.string().max(25).required(),
  });
  return schema.validate(defect);
}

module.exports.defectSchema = defectSchema;
module.exports.Defect = Defect;
module.exports.validateDefect = validateDefect;
