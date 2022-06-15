const mongoose = require("mongoose");
const Joi = require("joi");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    maxlength: 50,
  },
  manager: {
    type: new mongoose.Schema({
      name: Joi.string().max(50).required(),
    }),
    ref: "User",
    required: true,
  },
});

const Department = mongoose.model("department", departmentSchema);

function validateDepartment(department) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    managerId: Joi.objectId().required(),
  });
  return schema.validate(department);
}

module.exports.departmentSchema = departmentSchema;
module.exports.Department = Department;
module.exports.validateDepartment = validateDepartment;
