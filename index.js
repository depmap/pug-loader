const fs = require('fs')
const readline = require('readline')
const path = require('path')
const pug = require('pug')

const keywords = ['extends', 'include']

module.exports = {
  parse: (file, meta) => {
    return new Promise((resolve, reject) => {
      const deps = []
      const rl = readline.createInterface({
        input: fs.createReadStream(file, 'utf8')
      })

      rl.on('line', line => {
        if (line.indexOf(keywords[0]) > -1 || line.indexOf(keywords[1]) > -1) {
          let words = line.split(' ')
          let file = words[words.length - 1]
          deps.push(path.parse(file).name)
        }
      })
        .on('error', err => reject(err))
        .on('close', () => resolve(deps))
    })
  },
  compile: {
    string: (str, opts) => {
      return new Promise((resolve, reject) => {
        resolve(pug.render(str, opts))
      })
    },
    file: (path, opts) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) reject(err)
          resolve(pug.render(data, opts))
        })
      })
    }
  }
}
