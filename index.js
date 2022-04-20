const winston = require('winston')
const error = require('./middleware/error')
require('express-async-errors')
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const debug = require('debug')('app:startup')
const helmet = require('helmet')
const defects = require('./routes/defects')
const machines = require('./routes/machines')
const audits = require('./routes/audits')
const users = require('./routes/users')
const auditSettings = require('./routes/auditSettings')
const auth = require('./routes/auth')
const departments = require('./routes/departments')
const express = require('express');
const { level } = require('winston');

const app = express()

app.use(express.json())

winston.add(new winston.transports.File({'filename':'logfile.log',level:'error'}))

app.use(helmet())
app.use('/api/auth', auth)
app.use('/api/defects', defects)
app.use('/api/users', users)
app.use('/api/auditsettings', auditSettings)
app.use('/api/departments', departments)
app.use('/api/machines', machines)
app.use('/api/audits', audits)
require('./startup/db')()


app.use(error)






const port = process.env.PORT || 3000
app.listen(port,()=>debug(`Listeting to port ${port} ...`))



