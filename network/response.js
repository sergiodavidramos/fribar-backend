exports.success = (res, message = "All Correct", status = 200) => {
  res.status(status).send({ error: false, status, body: message });
};

exports.error = (res, error = "Internal server error", status = 500) => {
  res.status(status).send({ error: true, status, body: error });
};
exports.pdf = (res, message = "All Correct", status = 200) => {
  res.setHeader("Content-Type", "application/pdf");
  res.send(message);
  //   message.pipe(res);
};
