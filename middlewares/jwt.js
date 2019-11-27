const koaJwt = require('koa-jwt')
const jwt = require('jsonwebtoken')
const config = require('../config')

const jwtMiddleware = koaJwt({ secret: config.secret })

function decodeJWT (ctx, next) {
  // 将 token 中的数据解密后保存到 ctx 中
  try {
    if (typeof ctx.request.headers.authorization === 'string') {
      const token = ctx.request.headers.authorization.slice(7)
      ctx.jwtData = jwt.verify(token, config.secret)
    } else {
      throw {code: 401, success: false, message: 'no authorization', data: null}
    }
  } catch (err) {
    throw {code: 401, success:false, message: err.message, data: null}
  }
  next
}

module.exports = {
  jwtMiddleware,
  decodeJWT
}