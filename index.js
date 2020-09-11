const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./network/routes')
const db = require('./db')
const path = require('path')
const cors = require('cors')
require('dotenv').config()
var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
//   )
//   res.header(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, DELETE'
//   )
//   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
//   next()
// })

db(process.env.DB_URL)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, './public')))
router(app)

app.listen(process.env.PORT, () => {
  console.log('Server listen en the PORT: ', process.env.PORT)
})
