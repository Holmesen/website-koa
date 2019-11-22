const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const koaCors = require('koa-cors')
const routes = require('./routes/public')
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

// 跨域
app.use(koaCors(corsHandler))

app.use(routes.routes())
app.use(routes.allowedMethods())

app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())

app.use(blogRoutes.routes())
app.use(blogRoutes.allowedMethods())

// Response
// app.use(responseHandler)

app.listen(3000)