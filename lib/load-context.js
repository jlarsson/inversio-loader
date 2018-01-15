'use strict'
const discover = require('./discover')
const invariant = require('invariant')

class LoadContext {
  constructor (container, opts) {
    this._container = container
    this._opts = opts
  }
  component (/* ...components */) {
    [].slice.call(arguments).forEach(c => this._container.component(c))
    return this
  }
  /* async */ discover (opts) {
    let o = Object.assign({}, this._opts, opts)
    return this.load(discover(o))
  }

  /* async */ load (v) {
    // are we loading a single component?
    if (typeof v === 'string') {
      return this.load([v])
    }
    return Promise.resolve(v)
      .then(paths => {
        invariant(typeof paths === 'object', 'Expected array or object of paths')
        return paths
      })
      .then(paths => values(paths).reduce((p, path) => p.then(() => this.loadSingleFileComponent(path)), Promise.resolve()))
  }

  /* async */ loadSingleFileComponent (path) {
    let install = this._opts.install || ((path, container) => require(path).install(container))
    return new Promise(resolve => resolve(install(path, this._container)))
      .catch(err => {
        err.message = `${err.message} (while loading ${path})`
        throw err
      })
  }
}

function values (l) {
  if (Array.isArray(l)) {
    return l
  }
  if (typeof l === 'object') {
    return Object.keys(l).map(key => l[key])
  }
  return []
}
module.exports = LoadContext
