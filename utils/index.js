function subArr2Str(str) {
  if(str+'' !== 'undefined' && str+'' !== 'null' && typeof str !== String) {
    str += ''
  }
  if(!str || (str.indexOf('[')===-1) || (str.indexOf(']')===-1)) {
    return ''
  }
  return str.substring(str.indexOf('[')+1, str.indexOf(']'))
}

function randomString(len=16) {
  len = len > 16 ? 16 : len
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var str = ''
  for (i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

module.exports = {
  subArr2Str,
  randomString
}