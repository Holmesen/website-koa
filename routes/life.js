const Router = require('koa-router')
const router = new Router()
const life = require('../services').life

router.prefix('/life')
router.get('/getLife', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.fieldsMap) {
      ctx.body = '请传参数fieldsMap！'
    } else {
      let res = await life.getLife(query.fieldsMap, query.fields || '')
      if(res) {
        ctx.body = res
      } else {
        ctx.body = '没有数据'
      }
    }
  }
})

router.post('/addLife', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await life.addLife(ctx.request.body.fieldsMap)
      if(res) {
        ctx.body = '添加记事成功！'
      } else {
        ctx.body = '添加记事失败！'
      }
    }
  }
})

router.put('/updateLife', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap || !ctx.request.body.conditionsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await life.updateLife(ctx.request.body.fieldsMap, ctx.request.body.conditionsMap)
      if(res) {
        ctx.body = '修改记事信息成功！'
      } else {
        ctx.body = '修改记事信息失败！'
      }
    }
  }
})

router.delete('/deleteLife', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.conditionMap) {
      ctx.body = '请传参数conditionMap！'
    } else {
      let res = await life.deleteLife(query.conditionMap)
      if(res) {
        ctx.body = '删除记事成功！'
      } else {
        ctx.body = '删除记事失败！'
      }
    }
  }
})

router.post('/release', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.lifeData) {
      ctx.body = {success: false, message: '请传参数 lifeData', data: null}
    } else {
      // decodeJWT(ctx, next())
      // if(ctx.jwtData) {
      //   let res = await life.release(Object.assign(JSON.parse(ctx.request.body.lifeData), {ukeyid: ctx.jwtData.keyid || ''}))
      //   ctx.body = res
      // } else {
      //   ctx.body = {success: false, message: 'token身份验证失败！', data: null}
      // }
      let res = await life.release(JSON.parse(ctx.request.body.lifeData))
      ctx.body = res
    }
  }
})

// 根据记事id去查找记事
router.get('/get-idlist', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.lifeid) {
      ctx.body = {success: false, message: '请传参数 lifeid', data: null}
    } else {
      let res = await life.getLifeById(query.lifeid)
      if(res) {
        ctx.body = res
      } else {
        ctx.body = {success: false, message: '记事获取失败！', data: null}
      }
    }
  }
})

// 根据条件去查找记事
router.get('/get-list', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  let res = await life.getLife(query || null)
  if(res) {
    ctx.body = res
  } else {
    ctx.body = {success: false, message: '记事获取失败！', data: null}
  }
  // if(!query) {
  //   ctx.body = {success: false, message: '没有传参数！', data: null}
  // } else {
  //   let res = await life.getLife(query)
  //   if(res) {
  //     ctx.body = res
  //   } else {
  //     ctx.body = {success: false, message: '记事获取失败！', data: null}
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
    if(!ctx.request.body.lifeId) {
      ctx.body = {success: false, message: '请传记事id', data: null}
      return
    }
    if(!ctx.request.body.type) {
      ctx.body = {success: false, message: '请传操作类型', data: null}
      return
    }
    if(ctx.request.body.ukeyid && ctx.request.body.lifeId && ctx.request.body.type) {
      let res = await life.operate(ctx.request.body)
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
    if(!ctx.request.body.lkeyid) {
      ctx.body = {success: false, message: '请传记事id', data: null}
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
    let res = await life.comment(ctx.request.body)
    ctx.body = res
  }
})

router.get('/get-comment', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.lifeId) {
      ctx.body = {success: false, message: '请传记事id ！', data: null}
      return
    }
    let res = await life.getLifeComment(query.lifeId)
    if(res) {
      ctx.body = res
    } else {
      ctx.body = {success: false, message: '记事评论获取失败！', data: null}
    }
  }
})

router.get('/get-record', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.lkeyid && !query.lifeId && !query.ckeyid) {
      ctx.body = {success: false, message: '请传记事id ！', data: null}
      return
    }
    let res = await life.getLifeRecord(query)
    if(res) {
      ctx.body = res
    } else {
      ctx.body = {success: false, message: '', data: null}
    }
  }
})

router.get('/comment-record', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = {success: false, message: '没有传参数！', data: null}
  } else {
    if(!query.lkeyid && !query.lifeId) {
      ctx.body = {success: false, message: '请传记事id ！', data: null}
      return
    }
    if(!query.ukeyid) {
      ctx.body = {success: false, message: '请传操作者id', data: null}
      return
    }
    let res = await life.getCommentRecord(query)
    if(res) {
      ctx.body = res
    } else {
      ctx.body = {success: false, message: '', data: null}
    }
  }
})

router.post('/operate-comment', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.ukeyid) {
      ctx.body = {success: false, message: '请传操作者id', data: null}
      return
    }
    if(!ctx.request.body.ckeyid) {
      ctx.body = {success: false, message: '请传该条评论的id', data: null}
      return
    }
    if(!ctx.request.body.type) {
      ctx.body = {success: false, message: '请传操作类型', data: null}
      return
    }
    let res = await life.operateComment(ctx.request.body)
    ctx.body = res
  }
})

module.exports = router