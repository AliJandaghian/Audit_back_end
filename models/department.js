const mongoose = require("mongoose");
const Joi = require("joi");
require("joi-objectid")(Joi);


const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },

  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required: true,
  },
});

const Department = mongoose.model("department", departmentSchema);

function validatDepartment(department) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    managerId: Joi.object().required,
  });
  return schema.validate(department);
}

module.exports.departmentSchema = departmentSchema;
module.exports.Department = Department;
module.exports.validatDepartment = validatDepartment;
