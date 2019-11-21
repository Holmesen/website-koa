const file = require('fs')

const models = {}

const files = file.readdirSync(__dirname)
for(const file of files) {
  if(file.toLowerCase().endsWith('.js') && file.toLowerCase()!='index.js') {
    models[`${file.replace(/\.js/, '')}`] = require(`./${file}`)
  }
}

module.exports = models