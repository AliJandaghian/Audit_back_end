const mongoose = require("mongoose");
const Joi = require("joi");


const auditSchema = new mongoose.Schema({
  auditSetting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuditSetting",
    required: true,
  },
  machine: new mongoose.Schema({
    name: {
      type: String,
      minlength: 2,
      maxlength: 20,
      required: true,
    },
  }),

  defects: [
    new mongoose.Schema({
      name: {
        type: String,
        validate: {
          validator: function (v) {
            return v && v.length === 2;
          },
          message: "Defect Name must be 2 charecters long",
        },
        uppercase: true,
        required: true,
      },
    }),
  ],
  auditor: new mongoose.Schema({
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
      maxlenght: 255,
      trim: true,
    },
  }),
  auditDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Audit = mongoose.model("audit", auditSchema);

function validateAudit(audit) {
  const schema = Joi.object({
    auditSettingId: Joi.objectId().required(),
    machineId: Joi.objectId().required(),
    defectIds: Joi.array().items(Joi.objectId()),
  });

  return schema.validate(audit);
}

module.exports.Audit = Audit;
module.exports.validateAudit = validateAudit;
