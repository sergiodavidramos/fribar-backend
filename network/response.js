const statusMessage = {
  '200': 'Done',
  '201': 'Created',
  '400': 'INvalid Format',
  '500': 'Internal Error',
}
exports.success = (req, res, message, status) => {
  const statusCode = status
  const staMessage = message
  if (!status) statusCode = 200
//   if (!message) staMessage = statusMessage[statusCode]
  res.status(statusCode).send({ error: false, body: message })
}

exports.error = (req, res, error, status) => {
  res.status(status || 500).send({ error: true, body: error })
}
