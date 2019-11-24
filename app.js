const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const path = require('path')
const koaCors = require('koa2-cors')
const routes = require('./routes/public')
const uploadRoutes = require('./routes/uploadFile')
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')

const {loggerMiddleware} = require('./middlewares/logger')
const {errorHandler, responseHandler} = require('./middlewares/response')
const {corsHandler} = require('./middlewares/cors')

const app = new koa()

// Logger
app.use(loggerMiddleware)

// Error
app.use(errorHandler)

app.use(koaBodyparser())

// 静态资源处理
app.use(koaStatic(path.join(__dirname + "/public")))

// 跨域
app.use(koaCors(corsHandler))

app.use(routes.routes())
app.use(routes.allowedMethods())

// 上传文件路由
app.use(uploadRoutes.routes())
app.use(uploadRoutes.allowedMethods())

// 用户相关路由
app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())

// 博客相关路由
app.use(blogRoutes.routes())
app.use(blogRoutes.allowedMethods())

// Response
// app.use(responseHandler)

// app.listen(3000)

module.exports = app