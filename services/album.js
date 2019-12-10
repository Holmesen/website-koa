const albumM = require('../models').album
const subArr2Str = require('../utils').subArr2Str
const Decrypt = require('../utils/crypto').Decrypt
const Encrypt = require('../utils/crypto').Encrypt

const album = {}

album.upload = async (data)=> {
  const result = await albumM.upload(data)
  if(result.affectedRows>0) {
    return {success: true, message: '相册发布成功！', data: null}
  } else {
    return {success: false, message: '相册发布失败！', data: null}
  }
}

module.exports = album