const Router = require('koa-router')
const router = new Router()
const user = require('../services').user
const {jwtMiddleware, decodeJWT} = require('../middlewares/jwt')

router.prefix('/user')

router.get('/getUser', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.fieldsMap) {
      ctx.body = '请传参数fieldsMap！'
    } else {
      let res = await user.getUser(query.fieldsMap, query.fields || '')
      if(res) {
        ctx.body = res
      } else {
        ctx.body = '没有数据'
      }
    }
  }
})

router.post('/addUser', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await user.addUser(ctx.request.body.fieldsMap)
      if(res) {
        ctx.body = '添加用户成功！'
      } else {
        ctx.body = '添加用户失败！'
      }
    }
  }
})

router.put('/updateUser', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.fieldsMap || !ctx.request.body.conditionsMap) {
      ctx.body = '传入参数有误！'
    } else {
      let res = await user.updateUser(ctx.request.body.fieldsMap, ctx.request.body.conditionsMap)
      if(res) {
        ctx.body = '修改用户信息成功！'
      } else {
        ctx.body = '修改用户信息失败！'
      }
    }
  }
})

router.delete('/deleteUser', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query) {
    ctx.body = '参数错误！'
  } else {
    if(!query.conditionMap) {
      ctx.body = '请传参数conditionMap！'
    } else {
      let res = await user.deleteUser(query.conditionMap)
      if(res) {
        ctx.body = '删除用户成功！'
      } else {
        ctx.body = '删除用户失败！'
      }
    }
  }
})

router.post('/login', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.pwd || !ctx.request.body.name) {
      ctx.body = {success: false, message: '请检查用户名或密码！', data: null}
    } else {
      let res = await user.login({pwd: ctx.request.body.pwd, name: ctx.request.body.name})
      ctx.body = res
    }
  }
})

router.post('/signup', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.userData) {
      ctx.body = {success: false, message: '请传参数 userData', data: null}
    } else {
      let res = await user.signup(JSON.parse(ctx.request.body.userData))
      ctx.body = res
    }
  }
})

router.get('/get-info', async(ctx, next)=> {
  await next()
  decodeJWT(ctx, next())
  if(ctx.jwtData) {
    let res = await user.getInfo(ctx.jwtData)
    ctx.body = res
  } else {
    ctx.body = {success: false, message: 'token身份验证失败！', data: null}
  }
})

router.get('/get-assets', async(ctx, next)=> {
  await next()
  const query = ctx.request.query
  if(!query.ukeyid) {
    ctx.body = {success: false, message: '请传用户id！', data: null}
  } else {
    ctx.body = await user.getAssets(query)
  }
})

router.put('/update-info', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = {success: false, message: '没有传入数据！', data: null}
  } else {
    if(!ctx.request.body.data) {
      ctx.body = {success: false, message: '请传参数 data', data: null}
    } else {
      if(!JSON.parse(ctx.request.body.data).ukeyid) {
        ctx.body = {success: false, message: '请传用户id', data: null}
      } else {
        let res = await user.updateInfo(JSON.parse(ctx.request.body.data))
        ctx.body = res
      }
    }
  }
})

module.exports = router