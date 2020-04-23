const Router = require('koa-router')
const router = new Router()
const msg = require('../services').message

router.prefix('/message')
router.post('/opinion', async(ctx, next)=>{
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.contact) {
      ctx.body = {success: false, message: '请传参数 contact', data: null}
    } else {
      ctx.request.body.contact = JSON.parse(ctx.request.body.contact)
      const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
        (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.remoteAddress)))
      ctx.request.body.contact.ip = remoteAddress
      let res = await msg.submit(ctx.request.body.contact)
      ctx.body = res
    }
  }
})

module.exports = router