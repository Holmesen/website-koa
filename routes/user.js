const Router = require('koa-router')
const router = new Router()
const user = require('../services').user

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
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.pwd || !ctx.request.body.name) {
      ctx.body = '请检查用户名或密码！'
    } else {
      let res = await user.login({pwd: ctx.request.body.pwd, name: ctx.request.body.name})
      ctx.body = res
    }
  }
})

router.post('/signup', async(ctx, next)=> {
  await next()
  if(!ctx.request.body) {
    ctx.body = '没有传入数据！'
  } else {
    if(!ctx.request.body.userData) {
      ctx.body = '请传参数 userData'
    } else {
      let res = await user.signup(JSON.parse(ctx.request.body.userData))
      ctx.body = res
    }
  }
})

module.exports = router