const mongoose = require("mongoose");
const Joi = require("joi");

const defectSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        v.lenght = 2;
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
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 50,
      },
      email: {
        type: String,
        Required: true,
        minlenght: 6,
        maxlenght: 100,
      },
    }),
    required: true,
  },
});

const Defect = mongoose.model("defect", defectSchema);

function validatDefect(defect) {
  const schema = Joi.object({
    name: Joi.string().lenght(2).require(),
    description: Joi.string().max(25).require(),
  });
  return schema.validate(defect);
}

module.exports.defectSchema = defectSchema;
module.exports.Defect = Defect;
module.exports.validatDefect = validatDefect;
