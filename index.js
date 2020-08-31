const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./network/routes')
const db = require('./db')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
var corsOptions = {
  //   origin: 'http://localhost:3000',
  //   optionsSuccessStatus: 200,
  credentials: true,
}

app.all(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Credentials', 'include')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(cors(corsOptions))
db(process.env.DB_URL)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, './public')))
router(app)

app.listen(process.env.PORT, () => {
  console.log('Server listen en the PORT: ', process.env.PORT)
})
