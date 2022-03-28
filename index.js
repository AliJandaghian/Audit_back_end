const debug = require('debug')('app:startup')
const express = require('express')



const app = express()

app.use(express.json())









const port = process.env.PORT || 3000
app.listen(port,()=>debug(`Listeting to port ${port} ...`))



