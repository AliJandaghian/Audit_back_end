const express = require("express");
const {
  validateAuditSetting,
  AuditSetting,
} = require("../models/auditSetting");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const manager = require("../middleware/manager");
const validate = require("../middleware/validate");

const router = express.Router();

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const auditSetting = await AuditSetting.findById(req.params.id);
  if (!auditSetting)
    return res.status(404).send("No audit Setting found with given ID");
  res.send(auditSetting);
});

router.get("/", auth, async (req, res) => {
  const auditSettings = await AuditSetting.find().sort({ startDate: 1 });
  res.send(auditSettings);
});

router.post(
  "/",
  [auth, manager, validate(validateAuditSetting)],
  async (req, res) => {
    let auditSetting = await AuditSetting.findOne({ name: req.body.name });
    if (auditSetting) return res.status(400).send("Audit name already exists");

    auditSetting = new AuditSetting({
      name: req.body.name,
      department: req.body.departmentId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    await auditSetting.save();

    res.send(auditSetting);
  }
);

router.put(
  "/:id",
  [auth, manager, validateObjectId, validate(validateAuditSetting)],
  async (req, res) => {
    let auditSetting = await AuditSetting.findOne({ name: req.body.name });
    if (auditSetting && parseInt(req.params.id) != parseInt(auditSetting._id))
      return res.status(400).send("Audit Setting already exist");

    auditSetting = await AuditSetting.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        department: req.body.departmentId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      },
      { new: true }
    );

    res.send(auditSetting);
  }
);

router.delete("/:id", [auth, manager, validateObjectId], async (req, res) => {
  const auditSetting = await AuditSetting.findByIdAndDelete(req.params.id);
  if (!auditSetting)
    return res.status(404).send("No audit setting found with given ID");
  res.send(auditSetting);
});

module.exports = router;
