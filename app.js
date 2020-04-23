const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const path = require('path')
const koaCors = require('koa2-cors')
const uploadRoutes = require('./routes/uploadFile')
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const lifeRoutes = require('./routes/life')
const albumRoutes = require('./routes/album')
const messageRoutes = require('./routes/message')
const testRoutes = require('./routes/test')

const {loggerMiddleware} = require('./middlewares/logger')
const {errorHandler, responseHandler} = require('./middlewares/response')
const {corsHandler} = require('./middlewares/cors')
const {jwtMiddleware} = require('./middlewares/jwt')

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

// JWT验证
// app.use(jwtMiddleware.unless({ path: [/^\/public/] }))

// 上传文件路由
app.use(uploadRoutes.routes())
app.use(uploadRoutes.allowedMethods())

// 用户相关路由
app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())

// 博客相关路由
app.use(blogRoutes.routes())
app.use(blogRoutes.allowedMethods())

// 生活记事相关路由
app.use(lifeRoutes.routes())
app.use(lifeRoutes.allowedMethods())

// 相册相关路由
app.use(albumRoutes.routes())
app.use(albumRoutes.allowedMethods())

// 消息相关路由
app.use(messageRoutes.routes())
app.use(messageRoutes.allowedMethods())

// 测试用路由
app.use(testRoutes.routes())
app.use(testRoutes.allowedMethods())

// Response
// app.use(responseHandler)

// app.listen(3000)

module.exports = app