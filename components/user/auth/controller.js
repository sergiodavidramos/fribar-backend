const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()
require('../../../utils/strategies/basic')
function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('basic', function (err, user) {
      try {
        if (err || !user) {
          return reject(err)
        }
        req.login(user, { session: false }, async function (error) {
          if (error) {
            return reject(error)
          }
          const { _id: id, nombre, apellido, email, role } = user
          const payload = {
            id,
            nombre,
            apellido,
            email,
            role,
          }
          const token = jwt.sign(payload, process.env.AUTH_JWT_SECRET, {
            expiresIn: '100m',
          })
          return resolve({ token, user: { id, nombre, apellido, email } })
        })
      } catch (err) {
        return reject(err)
      }
    })(req, res, next)
  })
}

module.exports = {
  login,
}
