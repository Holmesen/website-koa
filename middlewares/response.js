const {logger} = require('./logger')

const responseHandler = ctx => {
  if(ctx.success) {
    ctx.type = 'json'
    ctx.body = {
      success: true,
      code: 200,
      message: ctx.msg || '',
      data: ctx.result
    }
  }
}

// 处理其他中间件中出现的异常
const errorHandler = (ctx, next) => {
  return next().catch(err => {
    if(err.code == null) {
      logger.error(err.stack)
    }
    ctx.body = {
      success: false,
      code: err.code || -1,
      data: null,
      message: err.message.trim()
    }
    // 保证返回状态是 200
    ctx.status = 200
    return Promise.resolve()
  })
}

module.exports = {
  responseHandler,
  errorHandler
}