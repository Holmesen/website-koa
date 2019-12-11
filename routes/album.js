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

router.get('/get-list', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  let res = await album.getList(query)
  if(res) {
    ctx.body = res
  } else {
    ctx.body = {success: false, message: '', data: null}
  }
})

module.exports = router