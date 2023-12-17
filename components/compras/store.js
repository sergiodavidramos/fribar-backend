const Compra = require("./model");

function addCompraDB(compra) {
  const newCompra = new Compra(compra);
  return newCompra.save();
}

module.exports = {
  addCompraDB,
};
