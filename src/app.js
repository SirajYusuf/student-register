const express = require('express')
require('./db/mongoose')
const studentRouter = require('./routes/studentRoute')
const app = express()

app.use(express.json())
app.use(studentRouter)

module.exports = app