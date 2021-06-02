const client = require('twilio')(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
)

async function getCode(phone, channel) {
  if (!phone || !channel)
    return Promise.reject({ message: 'Todos los campos son necesarios' })
  return client.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+${phone}`,
      channel: channel,
    })
}
async function verifyCode(phone, code) {
  if (!phone || !code)
    return Promise.reject({ message: 'Todos los campos son necesarios' })
  return client.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+${phone}`,
      code: code,
    })
}

module.exports = {
  getCode,
  verifyCode,
}
