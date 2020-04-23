const lifeM = require('../models').life
const subArr2Str = require('../utils').subArr2Str
const getTheDate = require('../utils').getTheDate
const Decrypt = require('../utils/crypto').Decrypt
const Encrypt = require('../utils/crypto').Encrypt

const life = {}

life.release = async (data)=> {
  const result = await lifeM.release(data)
  if(result.affectedRows>0) {
    return {success: true, message: '记事发布成功！', data: null}
  } else {
    return {success: false, message: '记事发布失败！', data: null}
  }
}

life.update = async (data)=> {
  data.updateTime = getTheDate()
  const result = await lifeM.update(data)
  if(result.affectedRows>0) {
    return {success: true, message: '记事更新成功！', data: null}
  } else {
    return {success: false, message: '记事更新失败！', data: null}
  }
}

life.delete = async(data)=> {
  const result = await lifeM.delete(data)
  if(result.affectedRows>0) {
    return {success: true, message: '记事删除成功！', data: null}
  } else {
    return {success: false, message: '记事删除失败！', data: null}
  }
}

life.getLifeById = async(data)=> {
  data = unescape(data)
  data = data.replace(/\[/g,'').replace(/\]/g,'')
  data = data.split(",")
  const result = await lifeM.getLifeById(data)
  if(result && result.length>0) {
    result.forEach(el => {
      el.category = el.category.split(',')
    })
    return {success: true, message: '获取记事成功！', data: result}
  } else {
    if(result.length === 0) {
      return {success: true, message: '记事为空！', data: []}
    }
    return {success: false, message: '获取记事失败！', data: null}
  }
}

life.getLife = async(data)=> {
  if(!data) {
    data = {}
  }
  if(data.category) {
    data.category = unescape(data.category)
  }
  if(!data.limit || data.limit<1) {
    data.limit = 10
  }
  if(!data.offset || data.offset<0) {
    data.offset = 0
  }
  const result = await lifeM.getLife(data)
  // await lifeM.record(data)
  if(result && result.length>0) {
    result.forEach(el => {
      el.category = el.category.split(',')
    })
    return {success: true, message: '获取记事成功！', data: result}
  } else {
    if(result.length === 0) {
      return {success: true, message: '记事为空！', data: []}
    }
    return {success: false, message: '获取记事失败！', data: null}
  }
}

life.operate = async(data)=> {
  if(['views', 'zan', 'cai', 'share', 'collect'].indexOf(data.type) === -1) {
    return {success: false, message: '操作类型错误！', data: null}
  }
  const result = await lifeM.operate(data)
  let result2 = null
  if(!!data.tag && data.tag === "0") {
    result2 = await lifeM.deleteRecord(data)
  } else {
    result2 = await lifeM.record(data)
  }
  if(result.affectedRows>0 && result2.affectedRows>0) {
    return {success: true, message: '操作成功！', data: null}
  } else {
    return {success: false, message: '操作失败！', data: null}
  }
}
life.operateComment = async(data)=> {
  if(['zan', 'cai'].indexOf(data.type) === -1) {
    return {success: false, message: '操作类型错误！', data: null}
  }
  const result = await lifeM.operateComment(data)
  let result2 = null
  if(!!data.tag && data.tag === "0") {
    result2 = await lifeM.deleteRecord(data)
  } else {
    result2 = await lifeM.record(data)
  }
  if(result.affectedRows>0 && result2.affectedRows>0) {
    return {success: true, message: '操作成功！', data: null}
  } else {
    return {success: false, message: '操作失败！', data: null}
  }
}

life.comment = async(data)=> {
  // if(['life', 'life'].indexOf(data.type) === -1) {
  //   return {success: false, message: '操作类型错误！', data: null}
  // }
  const result = await lifeM.comment(data)
  if(result.affectedRows>0) {
    return {success: true, message: '评论成功！', data: null}
  } else {
    return {success: false, message: '评论失败！', data: null}
  }
}

life.getLifeComment = async(data)=> {
  const result = await lifeM.getLifeComment(data)
  if(result) {
    return {success: true, message: '获取记事评论成功！', data: result}
  } else {
    return {success: false, message: '获取记事评论失败！', data: null}
  }
}

life.getLifeRecord = async(data)=> {
  const result = await lifeM.getRecord(data)
  if(result) {
    return {success: true, message: '', data: result}
  } else {
    return {success: false, message: '', data: null}
  }
}

life.getCommentRecord = async(data)=> {
  const result = await lifeM.getCommentRecord(data)
  if(result) {
    return {success: true, message: '', data: result}
  } else {
    return {success: false, message: '', data: null}
  }
}

module.exports = life