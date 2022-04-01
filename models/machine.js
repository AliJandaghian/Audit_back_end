const mongoose = require("mongoose");
const Joi = require("joi");
const objectId = require("joi-objectid")(Joi);

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 20,
    unique: true,
    required: true,
  },
  location: {
    type: new mongoose.Schema({
      name: Joi.string().max(50).required(),
    }),
    required: true,
  },
});

const Machine = mongoose.model("machine", machineSchema);

function validateMachine(machine) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    departmentId: objectId().required(),
  });
  return schema.validate(machine);
}

module.exports.Machine = Machine;
module.exports.validateMachine = validateMachine;
