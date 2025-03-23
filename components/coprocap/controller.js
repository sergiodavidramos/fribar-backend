const { getDatosGanadoDB } = require("./store");

function getDatosGanado(
  id,
  stadoAjuste,
  fechaInicio,
  fechaFin,
  ventaLibre,
  sociedad,
  des,
  limit
) {
  let filtroGanado = {};
  const desde = Number(des) || 0;
  const lim = Number(limit) | 10;
  if (id !== null) filtroGanado = { ...filtroGanado, _id: id };
  if (stadoAjuste !== null)
    filtroGanado = { ...filtroGanado, ajusteLote: stadoAjuste };
  if (ventaLibre !== null)
    filtroGanado = { ...filtroGanado, ventaLibreGanado: ventaLibre };
  if (sociedad !== null) filtroGanado = { ...filtroGanado, sociedad: sociedad };
  if (fechaInicio !== null && fechaFin !== null)
    filtroGanado = {
      ...filtroGanado,
      fechaFaineo: {
        $gte: new Date(fechaInicio),
        $lt: new Date(fechaFin),
      },
    };
  return getDatosGanadoDB(filtroGanado, desde, lim);
}

module.exports = {
  getDatosGanado,
};
