const Router = require('koa-router')
const router = new Router()
const upload = require('../lib/uploadFile')

const serverPath = require('../config').serverPath

router.prefix('/upload')

router.post('/avatar', upload('avatar').single('file'), async(ctx, next)=>{
  await next()
  ctx.body = {
    success: true,
    message: '头像上传成功！',
    data: { 
      name: ctx.req.file.filename,
      path: `${serverPath}/images/avatar/${ctx.req.file.filename}`
    }
  }
})

router.post('/blog-image', upload('blog').single('file'), async(ctx, next)=>{
  await next()
  ctx.body = {
    success: true,
    message: '博客图片上传成功！',
    data: { 
      name: ctx.req.file.filename,
      path: `${serverPath}/images/blog/${ctx.req.file.filename}`
    }
  }
})

router.post('/life-image', upload('life').single('file'), async(ctx, next)=>{
  await next()
  ctx.body = {
    success: true,
    message: '记事图片上传成功！',
    data: { 
      name: ctx.req.file.filename,
      path: `${serverPath}/images/life/${ctx.req.file.filename}`
    }
  }
})

router.post('/comment-image', upload('comment').single('file'), async(ctx, next)=>{
  await next()
  ctx.body = {
    success: true,
    message: '博客图片上传成功！',
    data: { 
      name: ctx.req.file.filename,
      path: `${serverPath}/images/comment/${ctx.req.file.filename}`
    }
  }
})

module.exports = router