const sql = require('../lib/mysql')
const randomString = require('../utils').randomString
const getTheDate = require('../utils').getTheDate

const blog = {}

/**
 * 获取博客
 * @param {JSON} fieldsMap 过滤的键值对
 * @param {Array} fields 想要查找的字段，默认所有字段
 */
// blog.getBlog = (fieldsMap, fields)=> {
//   let fmap = ''
//   for(let key in fieldsMap) {
//     fmap += `${key}="${fieldsMap[key]}" AND `
//   }
//   fmap = fmap.substring(0, fmap.lastIndexOf('AND'))
//   return sql(`SELECT ${fields} FROM blog WHERE ${fmap}`)
// }

/**
 * 添加博客
 * @param {String} fields 字段数组
 * @param {String} values 值数组
 */
// blog.addBlog = (fields, values)=> {
//   if(!fields || !values) {
//     return null
//   }
//   return sql(`INSERT INTO blog(${fields}) VALUES(${values})`)
// }

/**
 * 修改博客信息
 * @param {String} fieldsMap 要修改的键值对
 * @param {JSON} conditionsMap 约束条件
 */
// blog.updateBlog = (fieldsMap, conditionsMap)=> {
//   if(!fieldsMap || !conditionsMap) {
//     return null
//   }
//   let cmap = ''
//   for(let key in conditionsMap) {
//     cmap += `${key}="${conditionsMap[key]}" AND `
//   }
//   cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
//   return sql(`UPDATE blog SET ${fieldsMap} WHERE ${cmap}`)
// }

/**
 * 删除博客
 * @param {JSON} conditionMap 删除的约束条件
 */
// blog.deleteBlog = (conditionMap)=> {
//   if(!conditionMap) {
//     return null
//   }
//   let cmap = ''
//   for(let key in conditionMap) {
//     cmap += `${key}="${conditionMap[key]}" AND `
//   }
//   cmap = cmap.substring(0, cmap.lastIndexOf('AND'))
//   return sql(`DELETE FROM blog WHERE ${cmap}`)
// }

blog.release = (data)=> {
  return sql(`INSERT INTO blog(keyid, category, title, ukeyid, user, date, place, weather, content, views, zan, cai, collect, share, updateTime)
  VALUES('${randomString(16)}' ,'${data.category||[]}' ,'${data.title||''}' ,'${data.ukeyid||''}' ,'${data.user||''}'
   ,${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")} ,'${data.place||''}' ,'${data.weather||''}' ,'${data.content||''}' ,${data.views||0} ,${data.zan||0} ,${data.cai||0} , ${data.collect||0}, ${data.share||0}, ${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

blog.getBlogById = (data)=> {
  let str = ""
  data.forEach(item => {
    str += ` keyid='${item.trim()}' OR`
  })
  str = str.substring(0,str.length-2)
  return sql(`SELECT * FROM blog WHERE ${str} ORDER BY date ASC`)
}

blog.getBlog = (data)=> {
  let str = ""
  if(data) {
    if(data.user) {
      str += ` user='${data.user}' AND`
    }
    if(data.ukeyid) {
      str += ` ukeyid='${data.ukeyid}' AND`
    }
    if(data.date) {
      str += ` date='${data.date}' AND`
    }
    if(data.title) {
      str += ` title='${data.title}' AND`
    }
    if(data.category) {
      data.category = (data.category).replace(/\[/g,'').replace(/\]/g,'').replace(/\'/g,'').replace(/\"/g,'')
      let list = (data.category).split(",")
      list.forEach(item => {
        str += ` FIND_IN_SET('${item.trim()}', category) AND`
      })
    }
    if(data.user || data.ukeyid || data.date || data.title || data.category) {
      str = str.substring(0,str.length-3)
    }
  }
  return sql(`SELECT * FROM blog ${str? 'WHERE '+str : ''} ORDER BY date ASC`)
}

blog.operate = (data)=> {
  return sql(`UPDATE blog SET ${data.type}=${data.type}${data.tag==='0'?'-':'+'}1 WHERE keyid='${data.blogId}'`)
}

blog.operateComment = (data)=> {
  return sql(`UPDATE comment SET ${data.type}=${data.type}${data.tag==='0'?'-':'+'}1 WHERE keyid='${data.ckeyid}'`)
}

blog.comment = (data)=> {
  return sql(`INSERT INTO comment(keyid, tkeyid, ukeyid, date, content, type) 
    VALUES('${randomString(16)}', '${data.bkeyid}', '${data.ukeyid}', ${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")}, '${data.content}', '${data.type}')`)
}

blog.getBlogComment = (data)=> {
  return sql(`SELECT a.*, b.name, b.avatar FROM comment a LEFT JOIN user b ON b.keyid = a.ukeyid WHERE a.tkeyid = '${data}' AND a.type = '0' ORDER BY a.date ASC`)
}

blog.record = (data)=> {
  return sql(`INSERT INTO record(keyid, tkeyid, ukeyid, type, date) 
    VALUES('${randomString(16)}', '${data.bkeyid || data.blogId || data.ckeyid}', '${data.ukeyid}', '${data.type}', ${data.date?("'"+data.date+"'"):("'"+getTheDate()+"'")})`)
}

blog.getRecord = (data)=> {
  let str = ''
  if(data.ukeyid) {
    str += ` ukeyid='${data.ukeyid}' AND`
  }
  if(data.bkeyid || data.blogId || data.ckeyid) {
    str += ` tkeyid='${data.bkeyid || data.blogId || data.ckeyid}' AND`
  }
  if(data.type) {
    str += ` type='${data.type}' AND`
  }
  if(data.bkeyid || data.ukeyid || data.type) {
    str = str.substring(0,str.length-3)
  }
  return sql(`SELECT * FROM record ${str? 'WHERE '+str : ''} ORDER BY date ASC`)
}

blog.getCommentRecord = (data)=> {
  return sql(`SELECT * FROM record WHERE tkeyid IN (SELECT keyid FROM comment WHERE tkeyid='${data.bkeyid || data.blogId}') AND ukeyid='${data.ukeyid}'`)
  // return sql(`SELECT * FROM record WHERE tkeyid IN (SELECT keyid FROM comment WHERE tkeyid='${data.bkeyid || data.blogId}')`)
}

blog.deleteRecord = (data)=> {
  return sql(`DELETE FROM record WHERE tkeyid='${data.bkeyid || data.blogId || data.ckeyid}' AND ukeyid='${data.ukeyid}' AND type='${data.type}'`)
}

module.exports = blog