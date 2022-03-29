const debug = require('debug')('app:startup')
const helmet = require('helmet')
const defects = require('./routes/defects')
const users = require('./routes/users')
const config = require('config')
const express = require('express')

const app = express()

app.use(express.json())
app.use(helmet())



app.use('/api/defects', defects)
app.use('/api/users', users)
require('./startup/db')()









const port = process.env.PORT || 3000
app.listen(port,()=>debug(`Listeting to port ${port} ...`))



