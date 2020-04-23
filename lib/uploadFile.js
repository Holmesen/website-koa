const koaMulter = require('koa-multer')
const fs = require('fs')

function upload(type) {
  // let _path = ''
  // switch(type) {
  //   case 'avatar': _path = '/avatar'; break
  //   case 'blog': _path = '/blog'; break
  //   case 'life': _path = '/life'; break
  //   case 'comment': _path = '/comment'; break
  //   case 'album': _path = '/album'; break
  // }
  const storage = koaMulter.diskStorage({
    // 文件保存路径
    destination: function(req, file, cb) { 
      let obj = queryParser(req._parsedUrl.query)
      if (!fs.existsSync(`public`)){ fs.mkdirSync(`public`, { recursive: false }) }
      if (!fs.existsSync(`public/images`)){ fs.mkdirSync(`public/images`, { recursive: false }) }
      if (!fs.existsSync(`public/images/${type}`)){ fs.mkdirSync(`public/images/${type}`, { recursive: false }) }
      let dirP = `public/images/${type}${obj.keyid?('/'+obj.keyid) : ''}`
      if (!fs.existsSync(dirP)){ fs.mkdirSync(dirP, { recursive: false }) }
      cb(null, `${dirP}/`) 
    },
    // 修改文件名
    filename: function(req, file, cb) {
      var fileFormat = (file.originalname.split('.'))
      cb(null, Date.now() + "." +fileFormat[fileFormat.length - 1])
    }
  })

  // 加载配置
  return koaMulter({ storage: storage })
}

/**
 * 解析query参数
 * @param {String} query 
 */
function queryParser(query=""){
  let obj = {}
  if(!!query) {
    query = query.split('&')
    if(!!query) {
      query.forEach(el => {
        let tem = el.split("=")
        if(!!tem && tem.length>1) {
          obj[tem[0]] = tem[1]
        }
      })
    }
  }
  return obj
}


module.exports = upload