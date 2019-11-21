const fs = require('fs')

const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js')

const services = {}
for (const file of files) {
  if(file.toLowerCase().endsWith('js')) {
    services[`${file.replace(/\.js/, '')}`] = require(`./${file}`)
  }
}

module.exports = services