const Router = require('koa-router')
const router = new Router()
const test = require('../services').test
const {jwtMiddleware, decodeJWT} = require('../middlewares/jwt')

router.prefix('/test')
// router.use(jwtMiddleware)
router.post('/verify-token', async(ctx, next)=> {
  await next()
  // var res = await test.verifyToken(ctx, next)
  // var res = await decodeJWT(ctx, next)
  await new Promise((resolve, reject)=> {
    decodeJWT()
  }).then(res=>{
    console.log('res: ', res)
    console.log('ctx: ', ctx)
  }).finally(()=>{ctx.body = {}})
  
})

module.exports = router