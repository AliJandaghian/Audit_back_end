const mongoose = require("mongoose");
const Joi = require("joi");


const auditSettingSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    trim: true,
    lowercase : true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: new Date("2040-01-01"),
  },
});

const AuditSetting = mongoose.model('auditSetting',auditSettingSchema)


function validateAuditSetting(auditSetting) {
    const schema = Joi.object({
      name: Joi.string().max(50).required(),
      departmentId : Joi.objectId().required(),
      startDate : Joi.date(),
      endDate: Joi.date()
    });
    return schema.validate(auditSetting);
  }

  module.exports.validateAuditSetting = validateAuditSetting
  module.exports.AuditSetting = AuditSetting