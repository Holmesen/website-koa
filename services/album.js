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

album.update = async (data)=> {
  const result = await albumM.update(data)
  if(result.affectedRows>0) {
    return {success: true, message: '相册更新成功！', data: null}
  } else {
    return {success: false, message: '相册更新失败！', data: null}
  }
}

album.getList = async (data)=> {
  if(!data) {
    data = {}
  }
  if(!data.limit || data.limit<1) {
    data.limit = 10
  }
  if(!data.offset || data.offset<0) {
    data.offset = 0
  }
  const result = await albumM.getList(data)
  if(result && result.length>0) {
    result.forEach(el => {
      el.tags = el.tags.split(',')
      el.photos = el.photos.split("},")
      let list = []
      el.photos.forEach((el2,idx) => {
        if(idx!==el.photos.length-1) {
          el2 = el2 + "}"
        }
        list.push(JSON.parse(el2))
      })
      el.photos = list
    })
    return {success: true, message: '获取相册成功！', data: result}
  } else {
    if(result.length === 0) {
      return {success: true, message: '相册为空！', data: []}
    }
    return {success: false, message: '获取相册失败！', data: null}
  }
}

album.delete = async(data)=> {
  const result = await albumM.delete(data)
  if(result.affectedRows>0) {
    return {success: true, message: '相册删除成功！', data: null}
  } else {
    return {success: false, message: '相册删除失败！', data: null}
  }
}

album.getPhotos = async()=> {
  const result = await albumM.getPhotos()
  if(result && result.length>0) {
    result.forEach(el => {
      el.photos = el.photos.split("},")
      let list = []
      el.photos.forEach((el2,idx) => {
        if(idx!==el.photos.length-1) {
          el2 = el2 + "}"
        }
        list.push(JSON.parse(el2))
      })
      el.photos = list
    })
    return {success: true, message: '', data: result}
  } else {
    if(result.length === 0) {
      return {success: true, message: '没有照片！', data: []}
    }
    return {success: false, message: '获取相册失败！', data: null}
  }
}

module.exports = album