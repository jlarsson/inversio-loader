'use strict'
const inversio = require('inversio')
const LoadContext = require('./load-context')

class Loader {
  static create (opts) {
    return new Loader(opts)
  }
  constructor (opts) {
    this._opts = opts
    this._installers = []
  }
  component (/* ...components */) {
    [].slice.call(arguments).forEach(c => this._installers.push(context => context.component(c)))
    return this
  }
  use (/* ...modules */) {
    [].slice.call(arguments).forEach(m => this._installers.push(context => m(context)))
    return this
  }
  discover (opts) {
    this._installers.push(context => context.discover(opts))
    return this
  }
  /* async */ load () {
    // create container
    let container = inversio()
    // register the container in it self
    container.component({
      name: 'container',
      factory: () => container
    })
    // run all modules
    let context = new LoadContext(container, this._opts)
    return this._installers.reduce((p, f) => p.then(() => f(context)), Promise.resolve())
      .then(() => container)
  }
}

module.exports = Loader
