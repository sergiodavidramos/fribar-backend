const auth = require('../components/user/auth/network')
const user = require('../components/user/network')
const direction = require('../components/user/direccion/network')
const router = (server) => {
  server.use('/login', auth)
  server.use('/user', user)
  server.use('/direction', direction)
}
module.exports = router
