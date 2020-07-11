const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./network/routes')
const db=require('./db')
require('dotenv').config()

db('mongodb://localhost:27017/frifolly')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


router(app)

app.listen(process.env.PORT, () => {
  console.log('Server listen en the PORT: ', process.env.PORT)
})
