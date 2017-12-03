'use strict'
const discover = require('./discover')
const invariant = require('invariant')

class LoadContext {
  constructor (container, opts) {
    this._container = container
    this._opts = opts
  }
  async component (...components) {
    components.forEach(c => this._container.component(c))
    return this
  }
  async discover (opts) {
    let o = Object.assign({}, this._opts, opts)
    return this.load(discover(o))
  }

  async load (v) {
    // are we loading a single component?
    if (typeof v === 'string') {
      return this.load([v])
    }
    // evaluate to array or object
    let paths = await v
    invariant(typeof paths === 'object', 'Expected array or object of paths')
    // load each path in the array
    await Promise.all(Object
      .values(paths)
      .map(path => this.loadSingleFileComponent(path)))
  }

  async loadSingleFileComponent (path) {
    return new Promise(resolve => resolve(require(path).install(this._container)))
      .catch(err => {
        err.message = `${err.message} (while loading ${path})`
        throw err
      })
  }
}

module.exports = LoadContext
