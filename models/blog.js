const sql = require('../lib/mysql')

const blog = {}

/**
 * 获取博客
 * @param {JSON} fieldsMap 过滤的键值对
 * @param {Array} fields 想要查找的字段，默认所有字段
 */
blog.getBlog = (fieldsMap, fields)=> {
  let fmap = ''
  for(let key in fieldsMap) {
    fmap += `${key}="${fieldsMap[key]}" AND `
  }
  fmap = fmap.substring(0, fmap.lastIndexOf('AND'))
  return sql(`SELECT ${fields} FROM blog WHERE ${fmap}`)
}

/**
 * 添加博客
 * @param {String} fields 字段数组
 * @param {String} values 值数组
 */
blog.addBlog = (fields, values)=> {
  if(!fields || !values) {
    return null
  }
  return sql(`INSERT INTO blog(${fields}) VALUES(${values})`)
}

/**
 * 修改博客信息
 * @param {String} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
blog.updateBlog = (fieldsMap, conditionsMap)=> {
  if(!fieldsMap || !conditionsMap) {
    return null
  }
  let cmap = ''
  for(let key in conditionsMap) {
    cmap += `${key}="${conditionsMap[key]}" AND `
  }
  cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
  return sql(`UPDATE blog SET ${fieldsMap} WHERE ${cmap}`)
}

/**
 * 删除博客
 * @param {JSON} conditionMap 删除的约束条件
 */
blog.deleteBlog = (conditionMap)=> {
  if(!conditionMap) {
    return null
  }
  let cmap = ''
  for(let key in conditionMap) {
    cmap += `${key}="${conditionMap[key]}" AND `
  }
  cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
  return sql(`DELETE FROM blog WHERE ${cmap}`)
}

blog.getComment = ()=> {
  
}

module.exports = blog