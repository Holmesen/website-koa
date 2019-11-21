const userM = require('../models').user

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
  return await userM.login(data)
}

user.signup = async (data)=> {
  return await userM.signup(data)
}

module.exports = user