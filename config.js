const path = require('path')

module.exports = {
  host: '127.0.0.1',
  user: 'root',
  password: '0000',
  database: 'website',

  logPath: path.resolve(__dirname, './logs/koa-log.log'),

  secret: '我的密钥'
}