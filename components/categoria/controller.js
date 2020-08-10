const { addCategoryDB, getCategoryDB } = require('./store')

function getCategory() {
  return getCategoryDB()
}
function addCategory(body) {
  if (!body.name)
    return Promise.reject('El Nombre de la categoria es necesaria')

  const name = body.name.replace(/\b\w/g, (l) => l.toUpperCase())
  return addCategoryDB(name)
}

module.exports = {
  getCategory,
  addCategory,
}
