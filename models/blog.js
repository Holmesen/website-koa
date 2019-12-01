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
   ,${data.date?("'"+data.date+"'"):null} ,'${data.place||''}' ,'${data.weather||''}' ,'${data.content||''}' ,${data.views||0} ,${data.zan||0} ,${data.cai||0} , ${data.collect||0}, ${data.share||0}, ${data.updateTime?("'"+data.updateTime+"'"):null})`)
}

blog.getBlogById = (data)=> {
  let str = ""
  data.forEach(item => {
    str += ` keyid='${item.trim()}' OR`
  })
  str = str.substring(0,str.length-2)
  return sql(`SELECT * FROM blog WHERE ${str}`)
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
  return sql(`SELECT * FROM blog ${str? 'WHERE '+str : ''}`)
}

blog.operate = (data)=> {
  // let val = ''
  // switch(data.type) {
  //   case 'views': val = '0'; break
  //   case 'zan': val = '1'; break
  //   case 'cai': val = '2'; break
  //   case 'share': val = '3'; break
  //   case 'collect': val = '4'; break
  // }
  return sql(`UPDATE blog SET ${data.type}=${data.type}+1 WHERE keyid='${data.blogId}'`)
}

module.exports = blog