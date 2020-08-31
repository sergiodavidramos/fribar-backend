const fs = require('fs')
const axios = require('axios')
require('dotenv').config()
function subirFoto(req) {
  const tipo = req.params.tipo
  const id = req.params.id
  const tiposValidos = ['user', 'producto']
  const token = req.headers.authorization.split(' ')[1]
  return new Promise((resolve, reject) => {
    if (id !== req.user._id.toString() && tipo === 'user')
      return reject('No puedes cambiar la foto de otro usuario')
    if (tiposValidos.indexOf(tipo) < 0)
      return reject('Tipo de coleccion no es valido')
    if (!req.files)
      return reject('No selecciono nada debe seleccionar una imagen')
    const archivo = req.files.imagen
    const nombreCortado = []
    const extencionArchivo = []
    let cont = 0
    for (const data of archivo) {
      nombreCortado.push(data.name.split('.')[1])
      extencionArchivo.push(nombreCortado[cont])
      cont++
    }
    if (verificarExtencion(extencionArchivo))
      return reject({ message: 'Extencion no valida' })

    const nombreArchivo = []
    const path = []
    for (let i = 0; i < extencionArchivo.length; i++) {
      nombreArchivo.push(
        `${id}-${new Date().getMilliseconds() + i}.${extencionArchivo[i]}`
      )
      path.push(`./uploads/${tipo}/${nombreArchivo[i]}`)
      archivo[i].mv(path[i], (err) => {
        if (err) {
          return reject(err)
        }
      })
    }
    resolve(subirPorTipo(tipo, id, nombreArchivo, token, req.user))
  })
}
function verificarExtencion(extencion) {
  const extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']
  for (const data of extencion) {
    if (extencionesValidas.indexOf(data) < 0) {
      return true
    }
  }
  return false
}
async function subirPorTipo(tipo, id, nombreArchivo, token, usuarioDB) {
  try {
    if (tipo === 'user') {
      const pathViejo = './uploads/user/' + usuarioDB.img
      if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo)
      const user = await axios.patch(
        `${process.env.API_URL}/user/${id}`,
        { img: nombreArchivo },
        {
          responseType: 'json',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return user.data.body
    }
    if (tipo === 'producto') {
      const producto = await axios.get(
        `${process.env.API_URL}/productos?id=${id}`,
        {
          responseType: 'json',
        }
      )
      const pathViejo = producto.data.body.products[0].img
      if (pathViejo.length > 0) {
        for (const data of pathViejo) {
          if (fs.existsSync(`./uploads/producto/${data}`))
            fs.unlinkSync(`./uploads/producto/${data}`)
        }
      }
      const produc = await axios.patch(
        `${process.env.API_URL}/productos/${id}`,
        { img: nombreArchivo },
        {
          responseType: 'json',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return produc.data.body
    }
  } catch (error) {
    return Promise.reject({ message: 'No se pudo actualizar la foto' })
  }
}
module.exports = {
  subirFoto,
}
