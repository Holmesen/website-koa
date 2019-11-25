const Router = require('koa-router')
const router = new Router()
const test = require('../services').test
const {jwtMiddleware, decodeJWT} = require('../middlewares/jwt')

router.prefix('/test')
router.use(jwtMiddleware)
router.post('/verify-token', async(ctx, next)=> {
  await next()
  // var res = await test.verifyToken(ctx, next)
  ctx.body = {}
})

module.exports = router