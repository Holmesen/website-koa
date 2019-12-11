const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const album = {}

album.upload = (data)=> {
  return sql(`INSERT INTO album(keyid, name, ukeyid, tags, isPublic, photos, date, description, views, updateTime)
  VALUES('${randomString(16)}' ,'${data.name||''}' ,'${data.ukeyid||''}' ,'${data.tags||[]}' ,'${data.isPublic||''}' ,'${data.photos||[]}'
   ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,'${data.description||''}' ,${data.views||0} ,${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

album.getList = (data)=> {
  let str = ""
  if(data) {
    if(data.ukeyid) {
      str += ` ukeyid='${data.ukeyid}' AND`
    }
    if(data.isPublic) {
      str += ` isPublic='${data.isPublic}' AND`
    }
    if(data.date) {
      str += ` date='${data.date}' AND`
    }
    if(data.name) {
      str += ` name='${data.name}' AND`
    }
    if(data.tags) {
      data.tags = (data.tags).replace(/\[/g,'').replace(/\]/g,'').replace(/\'/g,'').replace(/\"/g,'')
      let list = (data.tags).split(",")
      list.forEach(item => {
        str += ` FIND_IN_SET('${item.trim()}', tags) AND`
      })
    }
    if(data.isPublic || data.ukeyid || data.date || data.name || data.tags) {
      str = str.substring(0,str.length-3)
    }
  }
  return sql(`SELECT * FROM album ${str? 'WHERE '+str : ''} ORDER BY date ASC`)
}

module.exports = album