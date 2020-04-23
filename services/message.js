const msgM = require('../models').message
const subArr2Str = require('../utils').subArr2Str
const getTheDate = require('../utils').getTheDate

const msg = {}

msg.submit = async (data)=> {
  const result = await msgM.submit(data)
  if(result.affectedRows>0) {
    return {success: true, message: '提交成功！', data: null}
  } else {
    return {success: false, message: '提交失败！', data: null}
  }
}

module.exports = msg