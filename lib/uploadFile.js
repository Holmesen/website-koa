const koaMulter = require('koa-multer')

const storage = koaMulter.diskStorage({
  // 文件保存路径
  destination: function(req, file, cb) { cb(null, 'public/images/avatar/') },
  // 修改文件名
  filename: function(req, file, cb) {
    var fileFormat = (file.originalname.split('.'))
    cb(null, Date.now() + "." +fileFormat[fileFormat.length - 1])
  }
})

// 加载配置
var upload = koaMulter({ storage: storage })

module.exports = upload