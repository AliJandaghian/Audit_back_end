const express = require("express");
const error = require("../middleware/error");
const defects = require("../routes/defects");
const machines = require("../routes/machines");
const audits = require("../routes/audits");
const users = require("../routes/users");
const auditSettings = require("../routes/auditSettings");
const auth = require("../routes/auth");
const cors = require('cors')
const departments = require("../routes/departments");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors())
  app.use("/api/auth", auth);
  app.use("/api/defects", defects);
  app.use("/api/users", users);
  app.use("/api/auditsettings", auditSettings);
  app.use("/api/departments", departments);
  app.use("/api/machines", machines);
  app.use("/api/audits", audits);
  app.use(error);
};
