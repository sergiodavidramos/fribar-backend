const passport = require('passport')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../model')
require('dotenv').config()
require('../../../utils/strategies/basic')
const client = new OAuth2Client(process.env.CLIENT_ID)
function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('basic', function (err, user) {
      if (err || !user) {
        return reject('Los campos son obligatorios')
      }
      req.login(user, { session: false }, function (error) {
        if (error) {
          return reject(error)
        }
        const token = generaToken(user)
        return resolve({
          token,
          usuario: user,
        })
      })
    })(req, res, next)
  })
}

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  })
  const payload = ticket.getPayload()
  return {
    nombre_comp: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  }
}

function generaToken(payload) {
  const usuario = {
    nombre_comp: payload.nombre_comp,
    email: payload.email,
  }
  return jwt.sign(usuario, process.env.AUTH_JWT_SECRET, {
    expiresIn: '100m',
  })
}
function loginGoogle(tokenGoogle) {
  return new Promise(async (resolve, reject) => {
    try {
      const googleUser = await verify(tokenGoogle).catch((e) => {
        reject(e)
      })
      const usuario = await User.findOne({ email: googleUser.email })

      if (usuario) {
        if (usuario.google === false)
          reject('Debe de usar su autenticacion normal')
        else {
          const token = generaToken(usuario)
          resolve({ usuario, token })
        }
      } else {
        const usuario = new User({
          nombre_comp: googleUser.nombre_comp,
          email: googleUser.email,
          img: googleUser.img,
          google: true,
          password: ':)',
        })

        usuario.save((err, usuario) => {
          if (err) reject(err)
          const token = generaToken(usuario)
          resolve({ usuario, token })
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

function loginFacebook(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const usuario = await User.findOne({ email: user.email })
      if (usuario) {
        if (usuario.facebook === false)
          reject('Debe de usar su autenticacion normal')
        else {
          const token = generaToken(usuario)
          resolve({ usuario, token })
        }
      } else {
        const userFacebook = new User({
          nombre_comp: user.nombre_comp,
          email: user.email,
          img: user.img,
          facebook: true,
          password: user.password,
        })
        userFacebook.save((err, usuarioDB) => {
          if (err) reject(err)
          const token = generaToken(usuarioDB)
          resolve({ usuarioDB, token })
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  login,
  loginGoogle,
  loginFacebook,
}
