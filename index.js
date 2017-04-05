const fs = require('fs')
const path = require('path')
const pug = require('pug')

const keywords = ['extends', 'include']

module.exports = {
  meta: {
    ext: 'pug',
    outExt: 'html'
  },
  parse: (file, meta) => {
    const deps = []
    fs.readFileSync(file).toString().split('\n').forEach(line => {
      if (line.indexOf(keywords[0]) > -1 || line.indexOf(keywords[1]) > -1) {
        let words = line.split(' ')
        let file = words[words.length - 1]
        deps.push(`pug_${file}`)
      }
    })

    return deps
  },
  compile: {
    string: (str, opts) => {
      return new Promise((resolve, reject) => {
        resolve(pug.render(str, opts))
      })
    },
    file: (path, opts) => {
      let html = pug.renderFile(path, opts)
      return html
    }
  }
}
