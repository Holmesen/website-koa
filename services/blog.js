const blogM = require('../models').blog
const subArr2Str = require('../utils').subArr2Str

const blog = {}

blog.getBlog = async (fieldsMap, fields='*')=> {
  if(!fieldsMap || fieldsMap+'' === '{}') {
    return null
  }
  fieldsMap = JSON.parse(fieldsMap)
  if(!fields) {
    fields = '*'
  }
  if(fields !== '*') {
    fields = subArr2Str(fields)
  }
  return await blogM.getBlog(fieldsMap, fields)
}

/**
 * 添加博客
 * @param {String} fieldsMap 字段值键值对
 */
blog.addBlog = async (fieldsMap)=> {
  if(!fieldsMap || fieldsMap+'' === '{}') {
    return null
  }
  fieldsMap = JSON.parse(fieldsMap)
  let keys = ''
  let vals = ''
  for(let key in fieldsMap) {
    keys += `${key},`
    vals += `"${fieldsMap[key]}",`
  }
  keys = keys.substring(0, keys.lastIndexOf(','))
  vals = vals.substring(0, vals.lastIndexOf(','))
  return await blogM.addBlog(keys, vals)
}

/**
 * 修改博客信息
 * @param {String} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
blog.updateBlog = async (fieldsMap, conditionsMap)=> {
  if(!fieldsMap || !conditionsMap || (fieldsMap+''==='{}') || (conditionsMap+''==='{}')) {
    return null
  }
  fieldsMap = JSON.parse(fieldsMap)
  conditionsMap = JSON.parse(conditionsMap)
  let fmap = ''
  for(let key in fieldsMap) {
    fmap += `${key}="${fieldsMap[key]}",`
  }
  fmap = fmap.substring(0, fmap.lastIndexOf(','))
  return await blogM.updateBlog(fmap, conditionsMap)
}

/**
 * 删除博客
 * @param {JSON} conditionMap 删除的约束条件
 */
blog.deleteBlog = async (conditionMap)=> {
  if(!conditionMap || conditionMap+'' === '{}') {
    return null
  }
  conditionMap = JSON.parse(conditionMap)
  return await blogM.deleteBlog(conditionMap)
}

module.exports = blog