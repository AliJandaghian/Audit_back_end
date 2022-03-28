const mongoose = require('mongoose')
const debug = require('debug')('app:db')
const config = require('config')

function connectToDB (){
    const db = config.get('db')
    mongoose.connect(db)
        .then(()=>debug(`connected to ${db}`))
        .catch((err)=>debug('Failed to connect to db'))
}

module.exports = connectToDB