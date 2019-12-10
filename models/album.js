const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const album = {}

album.upload = (data)=> {
  return sql(`INSERT INTO album(keyid, name, ukeyid, tags, isPublic, photos, date, description, views, updateTime)
  VALUES('${randomString(16)}' ,'${data.name||''}' ,'${data.ukeyid||''}' ,'${data.tags||[]}' ,'${data.isPublic||''}' ,'${data.list||[]}'
   ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,'${data.desc||''}' ,${data.views||0} ,${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

module.exports = album