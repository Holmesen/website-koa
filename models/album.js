const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const album = {}

album.upload = (data)=> {
  return sql(`INSERT INTO album(keyid, name, ukeyid, tags, isPublic, photos, date, description, views, updateTime)
  VALUES('${randomString(16)}' ,'${data.name||''}' ,'${data.ukeyid||''}' ,'${data.tags||[]}' ,'${data.isPublic||''}' ,'${data.photos||[]}'
   ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,'${data.description||''}' ,${data.views||0} ,${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

album.update = (data)=> {
  let str = ""
  if(data.isPublic) {
    str += `isPublic='${data.isPublic}',`
  }
  if(data.photos) {
    str += `photos='${data.photos}',`
  }
  if(data.name) {
    str += `name='${data.name}',`
  }
  if(data.tags) {
    str += `tags='${data.tags}',`
  }
  if(data.description) {
    str += `description='${data.description}',`
  }
  if(str) {str = str.substring(0,str.length-1)}
  return sql(`UPDATE album SET ${str} WHERE keyid='${data.keyid}'`)
}

album.getList = (data)=> {
  let str = ""
  if(data) {
    if(data.keyid) {
      str += ` AND keyid='${data.keyid}'`
    }
    if(data.ukeyid) {
      str += ` AND ukeyid='${data.ukeyid}'`
    }
    if(data.isPublic) {
      str += ` AND isPublic='${data.isPublic}'`
    }
    if(data.date) {
      str += ` AND date='${data.date}'`
    }
    if(data.name) {
      str += ` AND name='${data.name}'`
    }
    if(!data.limit || data.limit<1) {
      data.limit = 10
    }
    if(!data.offset || data.offset<0) {
      data.offset = 0
    }
    if(data.tags) {
      data.tags = (data.tags).replace(/\[/g,'').replace(/\]/g,'').replace(/\'/g,'').replace(/\"/g,'')
      let list = (data.tags).split(",")
      list.forEach(item => {
        str += ` AND FIND_IN_SET('${item.trim()}', tags)`
      })
    }
  }
  return sql(`SELECT * FROM album WHERE 1=1 ${str} ORDER BY date ASC LIMIT ${data.limit} OFFSET ${data.offset}`)
}

album.delete = (data)=> {
  return sql(`DELETE FROM album WHERE keyid='${data}'`)
}

album.getPhotos = ()=> {
  return sql(`SELECT keyid,ukeyid,photos FROM album WHERE isPublic='Y' ORDER BY rand()`)
}

module.exports = album