const userM = require('../models').user
const blogM = require('../models').blog
const lifeM = require('../models').life
const albumM = require('../models').album
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
      {name: data.name||'', pwd: Encrypt(data.pwd)||'', keyid: result[0].keyid}, 
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
  if(jwtData.pwd) {
    jwtData.pwd = Decrypt(jwtData.pwd)
  }
  const result = await userM.getInfo(jwtData)
  if(result && result.length>0) {
    return {success: true, message: '获取用户信息成功！', data: result}
  } else {
    return {success: false, message: '获取用户信息失败！', data: null}
  }
}

user.getAssets = async (query)=> {
  let result = {}
  let tags = []
  if(!query.tag) {
    tags = ["blog", "life", "album", "collect"]
  } else {
    query.tag = unescape(query.tag)
    query.tag = query.tag.replace(/\[/g,'').replace(/\]/g,'')
    tags = query.tag = query.tag.split(",")
  }
  if(tags.indexOf("blog") !== -1) {
    result["blog"] = await blogM.getBlog({ukeyid:query.ukeyid})
  }
  if(tags.indexOf("life") !== -1) {
    result["life"] = await lifeM.getLife({ukeyid:query.ukeyid})
  }
  if(tags.indexOf("album") !== -1) {
    let res = await albumM.getList({ukeyid:query.ukeyid})
    if(res && res.length>0) {
      res.forEach(el => {
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
    }
    result["album"] = res || []
  }
  if(tags.indexOf("collect") !== -1) {
    result["collect"] = await userM.getRecord({ukeyid:query.ukeyid, tag:'collect'})
  }
  // if(tags.indexOf("views") !== -1) {
  //   result["views"] = await userM.getRecord({ukeyid:query.ukeyid, tag:'views'})
  // }
  // if(tags.indexOf("cai") !== -1) {
  //   result["cai"] = await userM.getRecord({ukeyid:query.ukeyid, tag:'cai'})
  // }
  // if(tags.indexOf("zan") !== -1) {
  //   result["zan"] = await userM.getRecord({ukeyid:query.ukeyid, tag:'zan'})
  // }
  if(result) {
    return {success: true, message: '', data: result}
  } else {
    return {success: false, message: '', data: null}
  }
}

user.updateInfo = async (data)=> {
  if(data.pwd) {
    data.pwd.pwdOld = Decrypt(data.pwd.pwdOld)
    data.pwd.pwdNew = Decrypt(data.pwd.pwdNew)
    let res0 = await userM.checkUser(data)
    if(res0[0].pwd !== data.pwd.pwdOld) {
      return {success: false, message: '原密码错误！', data: null}
    }
  }
  let result = await userM.updateInfo(data)
  if(result.affectedRows>0) {
    let res = await userM.getUserById(data)
    if(res && res.length>0) {
      var token = jwt.sign(
        {name: res[0].name, pwd: Encrypt(res[0].pwd), keyid: res[0].keyid}, 
        config.secret, 
        {
          algorithm: 'HS256',
          expiresIn: '2h'
        }
      )
      return {success: true, message: '信息修改成功！', data: Object.assign({token}, res[0])}
    } else {
      return {success: false, message: '获取用户信息失败！', data: null}
    }
  } else {
    return {success: false, message: '信息修改失败！', data: null}
  }
}

module.exports = user