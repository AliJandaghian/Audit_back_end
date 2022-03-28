const debug = require('debug')('app:startup')
const helmet = require('helmet')
const config = require('config')
const express = require('express')





const app = express()



app.use(express.json())
app.use(helmet())








const port = process.env.PORT || 3000
app.listen(port,()=>debug(`Listeting to port ${port} ...`))



