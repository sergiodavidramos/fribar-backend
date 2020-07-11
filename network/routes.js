const auth = require('../components/user/auth/network')
const user = require('../components/user/network')
const router=(server)=>{
    server.use('/',auth)
    server.use('/user',user)
}
module.exports=router