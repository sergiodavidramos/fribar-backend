const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./network/routes')
const db = require('./db')
const path = require('path')
const cors = require('cors')
const server = require('http').Server(app)
const socket = require('./socket')
// const io = require('socket.io')(server)

require('dotenv').config()
var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
db(process.env.DB_URL)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, './public')))
socket.connect(server)
router(app)
socket.socket.io.on('connection', (cliente) => {
  console.log('cliente conectado')
  cliente.on('disconnect', () => {
    console.log('Client disconnected')
  })
})
server.listen(process.env.PORT, () => {
  console.log('Server listen en the PORT: ', process.env.PORT)
})
