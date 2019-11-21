const koa = require('koa')
const koaBodyparser = require('koa-bodyparser')
const routes = require('./routes/public')
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')

const app = new koa()

app.use(koaBodyparser())

app.use(routes.routes())
app.use(routes.allowedMethods())

app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())

app.use(blogRoutes.routes())
app.use(blogRoutes.allowedMethods())

app.listen(3000)