const Router = require('koa-router')
const router = new Router()
const album = require('../services').album

router.prefix('/album')

router.post('/upload', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.albumData) {
      ctx.body = {success: false, message: '请传参数 albumData', data: null}
    } else {
      let res = await album.upload(JSON.parse(ctx.request.body.albumData))
      ctx.body = res
    }
  }
})

module.exports = router