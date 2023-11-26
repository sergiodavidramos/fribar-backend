const auth = require("../components/user/auth/network");
const person = require("../components/persona/network");
const user = require("../components/user/network");
const direction = require("../components/user/direccion/network");
const productos = require("../components/productos/network");
const categoria = require("../components/categoria/network");
const detalle = require("../components/detalle/network");
const pedido = require("../components/pedidos/network");
const venta = require("../components/ventas/network");
const upload = require("../components/upload/network");
const offers = require("../components/ofertas/network");
const movimientos = require("../components/user/movimientos/network");
const verify = require("../components/verify/network");
const sucursal = require("../components/sucursal/network");
const ciudad = require("../components/ciudad/network");
const inventario = require("../components/inventario/network");
const marca = require("../components/marcas/network");
const proveedor = require("../components/proveedor/network");
const costodelivery = require("../components/costoEnvio/network");

const router = (server) => {
  server.use("/login", auth);
  server.use("/person", person);
  server.use("/user", user);
  server.use("/direction", direction);
  server.use("/productos", productos);
  server.use("/categoria", categoria);
  server.use("/detalle", detalle);
  server.use("/pedido", pedido);
  server.use("/venta", venta);
  server.use("/upload", upload);
  server.use("/offers", offers);
  server.use("/movimiento", movimientos);
  server.use("/verificar", verify);
  server.use("/sucursal", sucursal);
  server.use("/ciudad", ciudad);
  server.use("/inventario", inventario);
  server.use("/marca", marca);
  server.use("/proveedor", proveedor);
  server.use("/costo-envio", costodelivery);
};
module.exports = router;
