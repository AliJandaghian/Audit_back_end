const debug = require('debug')('app:startup')
const helmet = require('helmet')
const defects = require('./routes/defects')
const users = require('./routes/users')
const auth = require('./routes/auth')
const departments = require('./routes/departments')
const config = require('config')
const express = require('express')

const app = express()

app.use(express.json())
app.use(helmet())



app.use('/api/auth', auth)
app.use('/api/defects', defects)
app.use('/api/users', users)
app.use('/api/departments', departments)
require('./startup/db')()









const port = process.env.PORT || 3000
app.listen(port,()=>debug(`Listeting to port ${port} ...`))



