const koaMulter = require('koa-multer')

function upload(type) {
  let _path = ''
  switch(type) {
    case 'avatar': _path = '/avatar'; break
    case 'blog': _path = '/blog'; break
  }
  const storage = koaMulter.diskStorage({
    // 文件保存路径
    destination: function(req, file, cb) { cb(null, `public/images${_path}/`) },
    // 修改文件名
    filename: function(req, file, cb) {
      var fileFormat = (file.originalname.split('.'))
      cb(null, Date.now() + "." +fileFormat[fileFormat.length - 1])
    }
  })

  // 加载配置
  return koaMulter({ storage: storage })
}


module.exports = upload