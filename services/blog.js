const blogM = require('../models').blog
const subArr2Str = require('../utils').subArr2Str
const Decrypt = require('../utils/crypto').Decrypt
const Encrypt = require('../utils/crypto').Encrypt

const blog = {}

// blog.getBlog = async (fieldsMap, fields='*')=> {
//   if(!fieldsMap || fieldsMap+'' === '{}') {
//     return null
//   }
//   fieldsMap = JSON.parse(fieldsMap)
//   if(!fields) {
//     fields = '*'
//   }
//   if(fields !== '*') {
//     fields = subArr2Str(fields)
//   }
//   return await blogM.getBlog(fieldsMap, fields)
// }

/**
 * 添加博客
 * @param {String} fieldsMap 字段值键值对
 */
// blog.addBlog = async (fieldsMap)=> {
//   if(!fieldsMap || fieldsMap+'' === '{}') {
//     return null
//   }
//   fieldsMap = JSON.parse(fieldsMap)
//   let keys = ''
//   let vals = ''
//   for(let key in fieldsMap) {
//     keys += `${key},`
//     vals += `"${fieldsMap[key]}",`
//   }
//   keys = keys.substring(0, keys.lastIndexOf(','))
//   vals = vals.substring(0, vals.lastIndexOf(','))
//   return await blogM.addBlog(keys, vals)
// }

/**
 * 修改博客信息
 * @param {String} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
// blog.updateBlog = async (fieldsMap, conditionsMap)=> {
//   if(!fieldsMap || !conditionsMap || (fieldsMap+''==='{}') || (conditionsMap+''==='{}')) {
//     return null
//   }
//   fieldsMap = JSON.parse(fieldsMap)
//   conditionsMap = JSON.parse(conditionsMap)
//   let fmap = ''
//   for(let key in fieldsMap) {
//     fmap += `${key}="${fieldsMap[key]}",`
//   }
//   fmap = fmap.substring(0, fmap.lastIndexOf(','))
//   return await blogM.updateBlog(fmap, conditionsMap)
// }

/**
 * 删除博客
 * @param {JSON} conditionMap 删除的约束条件
 */
// blog.deleteBlog = async (conditionMap)=> {
//   if(!conditionMap || conditionMap+'' === '{}') {
//     return null
//   }
//   conditionMap = JSON.parse(conditionMap)
//   return await blogM.deleteBlog(conditionMap)
// }

blog.release = async (data)=> {
  const result = await blogM.release(data)
  if(result.affectedRows>0) {
    return {success: true, message: '博客发布成功！', data: null}
  } else {
    return {success: false, message: '博客发布失败！', data: null}
  }
}

blog.getBlogById = async(data)=> {
  data = unescape(data)
  data = data.replace(/\[/g,'').replace(/\]/g,'')
  data = data.split(",")
  const result = await blogM.getBlogById(data)
  if(result && result.length>0) {
    result.forEach(el => {
      el.category = el.category.split(',')
    })
    return {success: true, message: '获取博客成功！', data: result}
  } else {
    return {success: false, message: '获取博客失败！', data: null}
  }
}

blog.getBlog = async(data)=> {
  if(data && data.category) {
    data.category = unescape(data.category)
  }
  const result = await blogM.getBlog(data)
  // await blogM.record(data)
  if(result && result.length>0) {
    result.forEach(el => {
      el.category = el.category.split(',')
    })
    return {success: true, message: '获取博客成功！', data: result}
  } else {
    return {success: false, message: '获取博客失败！', data: null}
  }
}

blog.operate = async(data)=> {
  if(['views', 'zan', 'cai', 'share', 'collect'].indexOf(data.type) === -1) {
    return {success: false, message: '操作类型错误！', data: null}
  }
  const result = await blogM.operate(data)
  const result2 = await blogM.record(data)
  if(result.affectedRows>0 && result2.affectedRows>0) {
    return {success: true, message: '操作成功！', data: null}
  } else {
    return {success: false, message: '操作失败！', data: null}
  }
}

blog.comment = async(data)=> {
  // if(['blog', 'life'].indexOf(data.type) === -1) {
  //   return {success: false, message: '操作类型错误！', data: null}
  // }
  const result = await blogM.comment(data)
  if(result.affectedRows>0) {
    return {success: true, message: '评论成功！', data: null}
  } else {
    return {success: false, message: '评论失败！', data: null}
  }
}

blog.getBlogComment = async(data)=> {
  const result = await blogM.getBlogComment(data)
  if(result && result.length>0) {
    return {success: true, message: '获取博客评论成功！', data: result}
  } else {
    return {success: false, message: '获取博客评论失败！', data: null}
  }
}

module.exports = blog