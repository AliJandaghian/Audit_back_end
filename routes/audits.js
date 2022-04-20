const express = require("express");
const { Audit, validateAudit } = require("../models/audit");
const { Machine } = require("../models/machine");
const { Defect } = require("../models/defect");
const { AuditSetting } = require("../models/auditSetting");
const { User } = require("../models/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
const validate = require("../middleware/validate");
const endOfDay = require("date-fns/endOfDay");
const startOfDay = require("date-fns/startOfDay");
const { parseISO } = require("date-fns");

const router = express.Router();

router.get("/:settingName/:id", [auth, validateObjectId], async (req, res) => {
  throw new Error('Could not get audit');
  const audit = await Audit.findById(req.params.id);
  if (!audit) return res.status(404).send("No audit found with given ID");
  res.send(audit);
});

router.get(
  "/:settingId",
  [auth, manager, validateObjectId],
  async (req, res) => {
    const settingId = req.params.settingId;
    const auditSetting = await AuditSetting.findById(settingId);
    if (!auditSetting)
      return res.status(404).send("No audit found with given setting ID");

    let startDate = req.query.startDate
      ? parseISO(req.query.startDate)
      : auditSetting.startDate;

    let endDate = req.query.endDate ? parseISO(req.query.endDate) : new Date();
    const audits = await Audit.find({
      auditSetting: settingId,
      auditDate: {
        $gte: startOfDay(startDate),
        $lte: endOfDay(endDate),
      },
    }).sort({ auditDate: 1 });
    res.send(audits);
  }
);

router.post("/", [auth, validate(validateAudit)], async (req, res) => {
  const auditSetting = await AuditSetting.findById(req.body.auditSettingId);
  if (!auditSetting)
    return res.status(400).send("No audit found with given setting ID");

  const machine = await Machine.findById(req.body.machineId);
  if (!machine)
    return res.status(400).send("No machine found with given machine ID");

  const defectIds = req.body.defectIds;
  let defects = [];
  if (defectIds)
    defectIds.forEach(async (itm) => {
      const defect = await Defect.findById(itm);
      if (!defect)
        return res.status(400).send("No defect found with given defect ID");
      defects.push({ _id: defect._id, name: defect.name });
    });

  const user = await User.findOne({ email: req.user.email });

  const audit = new Audit({
    auditSetting: req.body.auditSettingId,
    machine: { _id: machine._id, name: machine.name },
    defects,
    auditor: { _id: user._id, name: user.name, email: user.email },
  });
  await audit.save();
  res.send(audit);
});

router.put(
  "/:settingId/:id",
  [auth, validateObjectId, validate(validateAudit)],
  async (req, res) => {
    const auditSetting = await AuditSetting.findById(req.body.auditSettingId);
    if (!auditSetting)
      return res.status(400).send("No audit found with given setting ID");

    const machine = await Machine.findById(req.body.machineId);
    if (!machine)
      return res.status(400).send("No machine found with given machine ID");

    const defectIds = req.body.defectIds;
    let defects = [];
    if (defectIds)
      defectIds.forEach(async (itm) => {
        const defect = await Defect.findById(itm);
        if (!defect)
          return res.status(400).send("No defect found with given defect ID");
        defects.push({ _id: defect._id, name: defect.name });
      });

    const user = await User.findOne({ email: req.user.email });

    const audit = await Audit.findByIdAndUpdate(
      req.params.id,
      {
        auditSetting: req.params.auditSettingId,
        machine: { _id: machine._id, name: machine.name },
        defects,
        auditor: { _id: user._id, name: user.name, email: user.email },
      },
      { new: true }
    );
    if (!audit) return res.status(404).send("No audit found with given ID");
    res.send(audit);
  }
);

router.delete("/:settingId/:id", [auth, validateObjectId], async (req, res) => {
  const audit = await Audit.findByIdAndDelete(req.params.id);
  if (!audit) return res.status(400).send("No audit found with given ID");
  res.send(audit);
});
module.exports = router;
