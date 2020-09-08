const Category = require('./model')

function getCategoryDB() {
  return Category.find()
}
function getCategoryIdDB(id) {
  return Category.find({ _id: id })
}
function addCategoryDB(name, description) {
  const newCategory = new Category({ name, description })
  return newCategory.save()
}
function updateCategoryDB(newCategory, id) {
  return Category.findByIdAndUpdate(id, newCategory, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}
module.exports = {
  getCategoryDB,
  addCategoryDB,
  getCategoryIdDB,
  updateCategoryDB,
}
