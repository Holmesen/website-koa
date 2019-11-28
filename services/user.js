const userM = require('../models').user
const jwt = require('jsonwebtoken')
const config = require('../config')
const Decrypt = require('../utils/crypto').Decrypt
const Encrypt = require('../utils/crypto').Encrypt

const user = {}

/**
 * 获取用户
 * @param {JSON} fieldsMap 过滤的键值对
 * @param {Array} fields 想要查找的字段，默认所有字段
 */
user.getUser = async (fieldsMap, fields)=> {
  return await userM.select(fieldsMap, fields)
}

/**
 * 添加用户1
 * @param {Array} fields 字段数组
 * @param {Array} values 值数组
 */
user.addUser1 = async (fields, values)=> {
  return await userM.add1(fields, values)
}

/**
 * 添加用户
 * @param {JSON} fieldsMap 用户信息的键值对
 */
user.addUser = async (fieldsMap)=> {
  return await userM.add2(fieldsMap)
}

/**
 * 修改用户信息
 * @param {JSON} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
user.updateUser = async (fieldsMap, conditionsMap)=> {
  return await userM.update(fieldsMap, conditionsMap)
}

/**
 * 删除用户
 * @param {JSON} conditionMap 删除的约束条件
 */
user.deleteUser = async (conditionMap)=> {
  return await userM.delete(conditionMap)
}

user.login = async (data)=> {
  data.pwd = Decrypt(data.pwd)
  const result = await userM.login(data)
  if(result && result.length>0) {
    var token = jwt.sign(
      {name: data.name||'', pwd: Encrypt(data.pwd)||'', keyid: Encrypt(data.keyid)}, 
      config.secret, 
      {
        algorithm: 'HS256',
        expiresIn: '2h'
      }
    )
    return {success: true, message: '登录成功！', data: Object.assign({token}, result[0])}
  } else {
    return {success: false, message: '登录失败！', data: null}
  }
}

user.signup = async (data)=> {
  data.pwd = Encrypt(data.pwd)
  const result = await userM.signup(data)
  if(result.affectedRows>0) {
    return {success: true, message: '注册成功！', data: null}
  } else {
    return {success: false, message: '注册失败！', data: null}
  }
}

user.getInfo = async (jwtData)=> {
  jwtData.pwd = Decrypt(jwtData.pwd)
  const result = await userM.getInfo(jwtData)
  if(result && result.length>0) {
    return {success: true, message: '获取用户信息成功！', data: result}
  } else {
    return {success: false, message: '获取用户信息失败！', data: null}
  }
}

module.exports = user