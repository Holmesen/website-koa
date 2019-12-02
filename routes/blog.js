const Router = require('koa-router')
const router = new Router()
const blog = require('../services').blog
const {jwtMiddleware, decodeJWT} = require('../middlewares/jwt')

router.prefix('/blog')
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
      let res = await blog.addBlog(ctx.request.body.fieldsMap)
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
      let res = await blog.updateBlog(ctx.request.body.fieldsMap, ctx.request.body.conditionsMap)
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
      let res = await blog.deleteBlog(query.conditionMap)
      if(res) {
        ctx.body = '删除博客成功！'
      } else {
        ctx.body = '删除博客失败！'
      }
    }
  }
})

router.post('/release', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.blogData) {
      ctx.body = {success: false, message: '请传参数 blogData', data: null}
    } else {
      // decodeJWT(ctx, next())
      // if(ctx.jwtData) {
      //   let res = await blog.release(Object.assign(JSON.parse(ctx.request.body.blogData), {ukeyid: ctx.jwtData.keyid || ''}))
      //   ctx.body = res
      // } else {
      //   ctx.body = {success: false, message: 'token身份验证失败！', data: null}
      // }
      let res = await blog.release(JSON.parse(ctx.request.body.blogData))
      ctx.body = res
    }
  }
})

// 根据博客id去查找博客
router.get('/get-idlist', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.blogid) {
      ctx.body = {success: false, message: '请传参数 blogid', data: null}
    } else {
      let res = await blog.getBlogById(query.blogid)
      if(res) {
        ctx.body = res
      } else {
        ctx.body = {success: false, message: '博客获取失败！', data: null}
      }
    }
  }
})

// 根据条件去查找博客
router.get('/get-list', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  let res = await blog.getBlog(query || null)
  if(res) {
    ctx.body = res
  } else {
    ctx.body = {success: false, message: '博客获取失败！', data: null}
  }
  // if(!query) {
  //   ctx.body = {success: false, message: '没有传参数！', data: null}
  // } else {
  //   let res = await blog.getBlog(query)
  //   if(res) {
  //     ctx.body = res
  //   } else {
  //     ctx.body = {success: false, message: '博客获取失败！', data: null}
  //   }
  // }
})

router.put('/operate', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.ukeyid) {
      ctx.body = {success: false, message: '请传操作者id', data: null}
      return
    }
    if(!ctx.request.body.blogId) {
      ctx.body = {success: false, message: '请传博客id', data: null}
      return
    }
    if(!ctx.request.body.type) {
      ctx.body = {success: false, message: '请传操作类型', data: null}
      return
    }
    if(ctx.request.body.ukeyid && ctx.request.body.blogId && ctx.request.body.type) {
      let res = await blog.operate(ctx.request.body)
      ctx.body = res
    }
  }
})

router.post('/comment', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.ukeyid) {
      ctx.body = {success: false, message: '请传操作者id', data: null}
      return
    }
    if(!ctx.request.body.bkeyid) {
      ctx.body = {success: false, message: '请传博客id', data: null}
      return
    }
    if(!ctx.request.body.content) {
      ctx.body = {success: false, message: '请传评论内容', data: null}
      return
    }
    if(!ctx.request.body.type) {
      ctx.body = {success: false, message: '请传评论的对象类型', data: null}
      return
    }
    let res = await blog.comment(ctx.request.body)
    ctx.body = res
  }
})

router.get('/get-comment', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.blogId) {
      ctx.body = {success: false, message: '请传博客id ！', data: null}
      return
    }
    let res = await blog.getBlogComment(query.blogId)
    if(res) {
      ctx.body = res
    } else {
      ctx.body = {success: false, message: '博客评论获取失败！', data: null}
    }
  }
})

module.exports = router