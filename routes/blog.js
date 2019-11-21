const Router = require('koa-router')
const router = new Router()
const blog = require('../services').blog

router.get('/getBlog', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.fieldsMap) {
      ctx.body = '请传参数fieldsMap！'
    } else {
      let res = await blog.getBlog(query.fieldsMap, query.fields || '')
      if(res) {
        ctx.body = res
      } else {
        ctx.body = '没有数据'
      }
    }
  }
})

router.post('/addBlog', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await user.addBlog(ctx.request.body.fieldsMap)
      if(res) {
        ctx.body = '添加博客成功！'
      } else {
        ctx.body = '添加博客失败！'
      }
    }
  }
})

router.put('/updateBlog', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap || !ctx.request.body.conditionsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await user.updateBlog(ctx.request.body.fieldsMap, ctx.request.body.conditionsMap)
      if(res) {
        ctx.body = '修改博客信息成功！'
      } else {
        ctx.body = '修改博客信息失败！'
      }
    }
  }
})

router.delete('/deleteBlog', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.conditionMap) {
      ctx.body = '请传参数conditionMap！'
    } else {
      let res = await user.deleteBlog(query.conditionMap)
      if(res) {
        ctx.body = '删除博客成功！'
      } else {
        ctx.body = '删除博客失败！'
      }
    }
  }
})

module.exports = router