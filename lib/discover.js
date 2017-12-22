'use strict'
const invariant = require('invariant')
const klaw = require('klaw')
const minimatch = require('minimatch')
const through2 = require('through2')

module.exports = opts => discover(opts || {})

/**
  * Create a new module that registers components based on a file pattern
  *
  */

/* async */ function discover ({cwd = null, filter = null}) {
  invariant(cwd, 'discover({cwd: <path to folder>}) - cwd is missing')
  invariant(filter, 'discover({filter: <glob|predicate>}) - filter is issing')

  return new Promise((resolve, reject) => {
    let paths = []
    klaw(cwd)
      .pipe(createFilterStream(filter))
      .on('data', item => paths.push(item.path))
      .on('error', reject)
      .on('end', () => resolve(paths))
  })
}

function createFilterStream (filter) {
  if (typeof filter === 'function') {
    return through2.obj(function (item, enc, next) {
      if (filter(item.path, item.stats)) this.push(item)
      next()
    })
  }
  return createFilterStream(minimatch.filter(filter, {matchBase: true}))
}
