const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const life = {}

life.release = (data)=> {
  return sql(`INSERT INTO life(keyid, category, title, ukeyid, date, place, weather, content, views, zan, cai, collect, share, updateTime)
  VALUES('${randomString(16)}' ,'${data.category||[]}' ,'${data.title||''}' ,'${data.ukeyid||''}' ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,
  '${data.place||''}' ,'${data.weather||''}' ,'${data.content||''}' ,${data.views||0} ,${data.zan||0} ,${data.cai||0} , ${data.collect||0}, ${data.share||0}, ${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

life.update = (data)=> {
  let str = ""
  if(data.title) {
    str += `title='${data.title}',`
  }
  if(data.place) {
    str += `place='${data.place}',`
  }
  if(data.weather) {
    str += `weather='${data.weather}',`
  }
  if(data.category) {
    str += `category='${data.category}',`
  }
  if(data.content) {
    str += `content='${data.content}',`
  }
  if(data.updateTime) {
    str += `updateTime='${data.updateTime}',`
  }
  if(str) {str = str.substring(0,str.length-1)}
  return sql(`UPDATE life SET ${str} WHERE keyid='${data.keyid}'`)
}

life.delete = (data)=> {
  return sql(`DELETE FROM life WHERE keyid='${data}'`)
}

life.getLifeById = (data)=> {
  let str = ""
  data.forEach(item => {
    str += ` a.keyid='${item.trim()}' OR`
  })
  str = str.substring(0,str.length-2)
  return sql(`SELECT a.*, b.name as user FROM life a LEFT JOIN user b ON b.keyid = a.ukeyid WHERE ${str} ORDER BY a.date ASC`)
}

life.getLife = (data)=> {
  let str = ""
  if(data) {
    if(data.ukeyid) {
      str += ` AND a.ukeyid='${data.ukeyid}'`
    }
    if(data.date) {
      str += ` AND a.date='${data.date}'`
    }
    if(data.title) {
      str += ` AND a.title='${data.title}'`
    }
    if(!data.limit || data.limit<1) {
      data.limit = 10
    }
    if(!data.offset || data.offset<0) {
      data.offset = 0
    }
    if(data.category) {
      data.category = (data.category).replace(/\[/g,'').replace(/\]/g,'').replace(/\'/g,'').replace(/\"/g,'')
      let list = (data.category).split(",")
      list.forEach(item => {
        str += ` AND FIND_IN_SET('${item.trim()}', a.category)`
      })
    }
  }
  return sql(`SELECT a.*, b.name as user FROM life a LEFT JOIN user b ON b.keyid = a.ukeyid WHERE 1=1 ${str} ORDER BY a.date ASC LIMIT ${data.limit} OFFSET ${data.offset}`)
}

life.operate = (data)=> {
  return sql(`UPDATE life SET ${data.type}=${data.type}${data.tag==='0'?'-':'+'}1 WHERE keyid='${data.lifeId}'`)
}

life.operateComment = (data)=> {
  return sql(`UPDATE comment SET ${data.type}=${data.type}${data.tag==='0'?'-':'+'}1 WHERE keyid='${data.ckeyid}'`)
}

life.comment = (data)=> {
  return sql(`INSERT INTO comment(keyid, tkeyid, ukeyid, date, content, type) 
    VALUES('${randomString(16)}', '${data.lkeyid}', '${data.ukeyid}', ${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")}, '${data.content}', '${data.type}')`)
}

life.getLifeComment = (data)=> {
  return sql(`SELECT a.*, b.name, b.avatar FROM comment a LEFT JOIN user b ON b.keyid = a.ukeyid WHERE a.tkeyid = '${data}' AND a.type = '0' ORDER BY a.date ASC`)
}

life.record = (data)=> {
  return sql(`INSERT INTO record(keyid, tkeyid, ukeyid, type, date) 
    VALUES('${randomString(16)}', '${data.lkeyid || data.lifeId || data.ckeyid}', '${data.ukeyid}', '${data.type}', ${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")})`)
}

life.getRecord = (data)=> {
  let str = ''
  if(data.ukeyid) {
    str += ` ukeyid='${data.ukeyid}' AND`
  }
  if(data.lkeyid || data.lifeId || data.ckeyid) {
    str += ` tkeyid='${data.lkeyid || data.lifeId || data.ckeyid}' AND`
  }
  if(data.type) {
    str += ` type='${data.type}' AND`
  }
  if(data.lkeyid || data.ukeyid || data.type) {
    str = str.substring(0,str.length-3)
  }
  return sql(`SELECT * FROM record ${str? 'WHERE '+str : ''} ORDER BY date ASC`)
}

life.getCommentRecord = (data)=> {
  return sql(`SELECT * FROM record WHERE tkeyid IN (SELECT keyid FROM comment WHERE tkeyid='${data.lkeyid || data.lifeId}') AND ukeyid='${data.ukeyid}'`)
  // return sql(`SELECT * FROM record WHERE tkeyid IN (SELECT keyid FROM comment WHERE tkeyid='${data.lkeyid || data.lifeId}')`)
}

life.deleteRecord = (data)=> {
  return sql(`DELETE FROM record WHERE tkeyid='${data.lkeyid || data.lifeId || data.ckeyid}' AND ukeyid='${data.ukeyid}' AND type='${data.type}'`)
}

module.exports = life