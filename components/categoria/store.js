const Category = require('./model')

function getCategoryDB() {
  return Category.find()
}
function addCategoryDB(name) {
  const newCategory = new Category({ name })
  return newCategory.save()
}

module.exports = {
  getCategoryDB,
  addCategoryDB
}
