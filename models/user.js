const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const user = {}

/**
 * 根据单个字段查找用户
 * @param {string} field 字段
 * @param {string} value 值
 */
user.findOne = (field, value)=> {
  if(field && value) {
    return sql(`SELECT * FROM user WHERE ? = ?`, [field, value])
  } else {
    return null
  }
}

/**
 * 获取用户
 * @param {JSON} fieldsMap 过滤的键值对
 * @param {Array} fields 想要查找的字段，默认所有字段
 */
user.select = (fieldsMap, fields='*')=> {
  if(fieldsMap+'' === '{}') {
    return null
  }
  fieldsMap = JSON.parse(fieldsMap)
  if(fields+'' === '[]' || !fields) {
    fields = '*'
  }
  if(fields !== '*') {
    fields = fields.replace(/\[/, '').replace(/\]/, '')
  }
  let fmap = ''
  for(let key in fieldsMap) {
    fmap += `${key}="${fieldsMap[key]}" AND `
  }
  fmap = fmap.substring(0, fmap.lastIndexOf('AND'))
  return sql(`SELECT ${fields} FROM user WHERE ${fmap}`)
}

/**
 * 添加用户
 * @param {Array} fields 字段数组
 * @param {Array} values 值数组
 */
user.add1 = (fields, values)=> {
  const str = ''
  if(!values || !values.length) {
    return null
  }
  values = values.flat(Infinity).replace(/\[/, '').replace(/\]/, '')
  if(fields && fields.length){
    fields = fields.flat(Infinity).replace(/\[/, '').replace(/\]/, '')
    str = `INSERT INTO user(${fields}) VALUES(${values})`
  } else {
    str = `INSERT INTO user VALUES(${values})`
  }
  return sql(str)
}

/**
 * 添加用户
 * @param {JSON} fieldsMap 用户信息的键值对
 */
user.add2 = (fieldsMap)=> {
  if(!fieldsMap || fieldsMap+''==='{}') {
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
  return sql(`INSERT INTO user(${keys}) VALUES(${vals})`)
}

/**
 * 修改用户信息
 * @param {JSON} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
user.update = (fieldsMap, conditionsMap)=> {
  if(!fieldsMap || !conditionsMap || (fieldsMap+''==='{}') || (conditionsMap+''==='{}')) {
    return null
  }
  fieldsMap = JSON.parse(fieldsMap)
  conditionsMap = JSON.parse(conditionsMap)
  let fmap = ''
  let cmap = ''
  for(let key in fieldsMap) {
    fmap += `${key}="${fieldsMap[key]}",`
  }
  fmap = fmap.substring(0, fmap.lastIndexOf(','))
  for(let key in conditionsMap) {
    cmap += `${key}="${conditionsMap[key]}" AND `
  }
  cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
  return sql(`UPDATE user SET ${fmap} WHERE ${cmap}`)
}

/**
 * 删除用户
 * @param {JSON} conditionMap 删除的约束条件
 */
user.delete = (conditionMap)=> {
  if(!conditionMap || conditionMap+'' === '{}') {
    return null
  }
  conditionMap = JSON.parse(conditionMap)
  let cmap = ''
  for(let key in conditionMap) {
    cmap += `${key}="${conditionMap[key]}" AND `
  }
  cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
  return sql(`DELETE FROM user WHERE ${cmap}`)
}

user.login = (data)=> {
  // return sql(`SELECT COUNT(*) FROM user WHERE name='${data.name}' AND pwd='${data.pwd}'`)
  return sql(`SELECT keyid, name, sex, birthday, avatar, introduction, roles, DATE_FORMAT(date,'%Y-%m-%d %T') AS date, DATE_FORMAT(updateTime,'%Y-%m-%d %T') AS updateTime FROM user WHERE name='${data.name}' AND pwd='${data.pwd}'`)
}

user.signup = (data)=> {
  return sql(`INSERT INTO user(keyid, name, pwd, sex, birthday, avatar, introduction, roles, date, updateTime)
   VALUES('${randomString(16)}' ,'${data.name||''}' ,'${data.pwd||''}' ,'${data.sex||''}' ,${data.birthday?("'"+data.birthday+"'"):null}
    ,'${data.avatar||''}' ,'${data.introduction||''}' ,'' ,'${getTheDate()}' , ${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

user.getInfo = (data)=> {
  return sql(`SELECT keyid, name, sex, birthday, avatar, introduction, roles, DATE_FORMAT(date,'%Y-%m-%d %T') AS date, DATE_FORMAT(updateTime,'%Y-%m-%d %T') AS updateTime FROM user WHERE ${data.keyid?("keyid='"+data.keyid+"'"):("name='"+data.name+"' AND pwd='"+data.pwd+"'")}`)
}

user.getUserById = (data)=> {
  return sql(`SELECT * FROM user WHERE keyid='${data.ukeyid}'`)
}

user.getRecord = (data)=> {
  return sql(`SELECT keyid, title, content, DATE_FORMAT(date,'%Y-%m-%d %T') AS date, DATE_FORMAT(updateTime,'%Y-%m-%d %T') AS updateTime, 'blog' AS tag FROM blog WHERE keyid IN (SELECT tkeyid FROM record WHERE type='${data.tag}' AND ukeyid='${data.ukeyid}')
    UNION SELECT keyid, title, content, DATE_FORMAT(date,'%Y-%m-%d %T') AS date, DATE_FORMAT(updateTime,'%Y-%m-%d %T') AS updateTime, 'life' AS tag FROM life WHERE keyid IN (SELECT tkeyid FROM record WHERE type='${data.tag}' AND ukeyid='${data.ukeyid}')`)
}

user.checkUser = (data)=> {
  return sql(`SELECT pwd, name FROM user WHERE keyid='${data.ukeyid}'`)
}

user.updateInfo = (data)=> {
  let str = ''
  if(data.avatar) {
    str += `avatar='${data.avatar}',`
  }
  if(data.name) {
    str += `name='${data.name}',`
  }
  if(data.pwd && data.pwd.pwdNew) {
    str += `pwd='${data.pwd.pwdNew}',`
  }
  if(data.sex) {
    str += `sex='${data.sex}',`
  }
  if(data.birthday) {
    str += `birthday='${data.birthday}',`
  }
  if(data.intro) {
    str += `introduction='${data.intro}',`
  }
  if(str) {str = str.substring(0,str.length-1)}
  return sql(`UPDATE user SET ${str} WHERE keyid='${data.ukeyid}'`)
}

module.exports = user