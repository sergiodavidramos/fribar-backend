const fs = require('fs')
const axios = require('axios')
const url = 'http://localhost:3000/'
function subirFoto(req) {
  const tipo = req.params.tipo
  const id = req.params.id
  const tiposValidos = ['user', 'producto']
  const token = req.headers.authorization.split(' ')[1]
  return new Promise((resolve, reject) => {
    if (id !== req.user._id.toString() && tipo === 'user')
      return Promise.reject('No puedes cambiar la foto de otro usuario')
    if (tiposValidos.indexOf(tipo) < 0)
      return reject('Tipo de coleccion no es valido')
    if (!req.files)
      return reject('No selecciono nada debe seleccionar una imagen')
    const archivo = req.files.imagen
    const nombreCortado = archivo.name.split('.')
    const extencionArchivo = nombreCortado[nombreCortado.length - 1]
    if (verificarExtencion(extencionArchivo))
      return reject('Extencion no valida')

    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`
    const path = `./uploads/${tipo}/${nombreArchivo}`
    archivo.mv(path, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve(
        subirPorTipo(tipo, id, nombreArchivo, token, req.user)
      )
    })
  })
}
function verificarExtencion(extencion) {
  const extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']
  if (extencionesValidas.indexOf(extencion) < 0) {
    return true
  }
  return false
}
async function subirPorTipo(tipo, id, nombreArchivo, token, usuarioDB) {
  try {
    if (tipo === 'user') {
      const pathViejo = './uploads/user/' + usuarioDB.img
      if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo)
      const user = await axios.patch(
        `${url}user/${id}`,
        { img: nombreArchivo },
        {
          responseType: 'json',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return user.data.body
    }
    if (tipo === 'producto') {
      const producto = await axios.get(`${url}productos?id=${id}`, {
        responseType: 'json',
      })
      const pathViejo =
        './uploads/producto/' + producto.data.body.products[0].img
      if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo)
      const produc = await axios.patch(
        `${url}productos/${id}`,
        { img: nombreArchivo },
        {
          responseType: 'json',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return produc.data.body
    }
  } catch (error) {
    return Promise.reject('No se pudo actualizar la foto')
  }
}
module.exports = {
  subirFoto,
}
