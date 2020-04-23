const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const msg = {}

msg.submit = (data)=> {
  return sql(`INSERT INTO message(keyid, name, way, subject, message, ip, date)
  VALUES('${randomString(16)}' ,'${data.name||data.ip||'none'}' ,'${data.way||''}' ,'${data.subject||''}', '${data.message||''}', '${data.ip||''}' ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} )`)
}

module.exports = msg