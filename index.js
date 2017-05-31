const fs = require('fs')
const path = require('path')
const pug = require('pug')

const keywords = ['extends', 'include']

module.exports = {
  meta: {
    ext: '.pug',
    outExt: '.html'
  },
  parse: (file, meta) => {
    const deps = []
    let relativeDir = file.split('/').slice(0, -1).join('/')
    fs.readFileSync(file).toString().split('\n').forEach(line => {
      if (line.indexOf(keywords[0]) > -1 || line.indexOf(keywords[1]) > -1) {
        let words = line.split(' ')
        let dep = words[words.length - 1]
        if (dep.indexOf(meta.ext) === -1)
          dep = dep + meta.ext

        deps.push(path.join(relativeDir, dep))
      }
    })

    return deps
  },
  compile: {
    string: (str, opts) => {
      let html = pug.render(str, opts)
      return html
    },
    file: (path, opts) => {
      let html = pug.renderFile(path, opts)
      return html
    }
  }
}
