const axios = require('axios')

async function hola() {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmVfY29tcCI6IkVyZ2lvIERhdmlkIFJhbW9zIiwiZW1haWwiOiJzZXJnaW9yYW1vc2RhdmlkMDI4QGdtYWlsLmNvbSIsImlhdCI6MTU5NzE5NDU3OSwiZXhwIjoxNTk3MjAwNTc5fQ.DlGvUow8URMkFxJV90KFgx2At8ttnFYpE9hnBly8Thc'
  const id = '5f318ea5887264203c1f246e'
  const probar = await axios.get(`http://localhost:3000/user?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'json',
  })
  console.log('user', probar.data.body.users)
}

hola()
