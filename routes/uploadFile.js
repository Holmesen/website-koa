const Router = require('koa-router')
const router = new Router()
const upload = require('../lib/uploadFile')

router.post('/avatar', upload.single('file'), async(ctx, next)=>{
  ctx.body = {
    success: true,
    msg: '头像上传成功！',
    data: { 
      name: ctx.req.file.filename,
      path: `/images/avatar/${ctx.req.file.filename}`
    }
  }
})

module.exports = router