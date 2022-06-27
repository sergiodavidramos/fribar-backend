const passport = require('passport')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../model')
const fetch = require('node-fetch')
require('dotenv').config()
require('../../../utils/strategies/basic')
const client = new OAuth2Client(process.env.CLIENT_ID)
function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate('basic', function (err, user) {
      if (err || !user) {
        return reject({
          message: 'Datos incorrectos por favor intentelo nuevamente',
        })
      }
      req.login(user, { session: false }, function (error) {
        if (error) {
          return reject({ message: error })
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
    expiresIn: '180d',
  })
}
function loginGoogle(tokenGoogle) {
  return new Promise(async (resolve, reject) => {
    try {
      const googleUser = await verify(tokenGoogle).catch((e) => {
        return reject({ message: e })
      })
      const usuario = await User.findOne({ email: googleUser.email })
      if (usuario) {
        if (usuario.google === false)
          return reject({
            message: 'Debe de usar su autenticacion normal',
          })
        else {
          const token = generaToken(usuario)
          return resolve({ usuario, token })
        }
      } else {
        const persona = await fetch(`${process.env.API_URL}/person`, {
          method: 'POST',
          body: JSON.stringify({
            nombre_comp: googleUser.nombre_comp,
          }),
          headers: { 'Content-Type': 'application/json' },
        })
        const datos = await persona.json()
        if (datos.error || !datos.body._id)
          return reject({ message: 'Error al crear persona' })
        const usuario = new User({
          idPersona: datos.body._id,
          email: googleUser.email,
          img: googleUser.img,
          google: true,
          password: ':)',
        })

        usuario.save((err, usuario) => {
          if (err) return reject({ message: err })
          const token = generaToken(usuario)
          return resolve({ usuario, token })
        })
      }
    } catch (e) {
      reject({ message: e })
    }
  })
}

async function verifyFacebook(userID, accessToken) {
  try {
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
    const response = await fetch(urlGraphFacebook, { method: 'GET' })
    const userFacebook = response.json()
    return userFacebook
  } catch (error) {
    return false
  }
}
function loginFacebook({ userID, accessToken }) {
  return new Promise(async (resolve, reject) => {
    try {
      const userFacebook = await verifyFacebook(userID, accessToken)
      if (!userFacebook || !userFacebook.email) {
        return reject({
          message:
            'lo siento, puede que su cuenta o su email con Facebook sea privada no pudimos autenticar',
        })
      }
      const usuario = await User.findOne({ email: userFacebook.email })
      if (usuario !== null) {
        if (usuario.facebook === false)
          return reject({
            message: 'Debe de usar su autenticacion normal',
          })
        else {
          const token = generaToken(usuario)
          return resolve({ usuario, token })
        }
      } else {
        const userFa = new User()
        ;(userFa.nombre_comp = userFacebook.name),
          (userFa.email = userFacebook.email),
          (userFa.img = userFacebook.picture.data.url),
          (userFa.facebook = true),
          (userFa.password = userFacebook.id),
          userFa.save((err, usuarioDB) => {
            if (err) {
              return reject({ message: err })
            }
            const token = generaToken(usuarioDB)
            return resolve({ usuario: usuarioDB, token })
          })
      }
    } catch (err) {
      return reject({ message: err.message })
    }
  })
}

module.exports = {
  login,
  loginGoogle,
  loginFacebook,
}
