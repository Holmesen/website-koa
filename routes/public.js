const Router = require('koa-router')
const router = new Router()
const test = require('../services').test

router.get('/test', async(ctx, next)=>{
  await next()
  var res = await test.test1()
  if(!res) {
    ctx.response.body = '没数据！'
  } else {
    ctx.response.body = res
  }
})
router.get('/abc', async(ctx, next)=> {
  await next()
  ctx.body = '<h1>ABC</h1>'
})

module.exports = router