# inversio-loader

Convention based initialization of [inversio](https://www.npmjs.com/package/inversio) containers.

Load components and dependencies from file structure using file patterns, single file components and modules.

# API
_cwd_ (_current working directory_) denotes root folder for searches.

_filter_ should either be a
  - predicate as in ```path -> boolean```
  - string (glob) that will be converted to a [minimatch](https://www.npmjs.com/package/minimatch) predicate.

## new Loader({pattern?})
Construct new loader instance. If _pattern_ is specified, it will be passed as default to ```discover({cwd, pattern})```.

## create({pattern?}) -> Loader
Shorthand for creating Loader instance.
```js
const loader = require('inversio-loader').create

let continer = await loader().use(...).discover(...).component(...).load()

```
## .use(module) -> Loader
Allow module to register. Module should be a
```js
function moduleFunction (loader) {
    // loader.discover(...)
    // loader.use(...)
    // loader.component(...)
  }
```
or
```js
async function asyncModuleFunction (loader) { ... }
```

## .use(...modules) -> Loader
Register multiple modules.

## .discover({cwd, pattern}) -> Loader
_pattern_ defaults to pattern specified in constructor. _cwd_ is root folder for single file component search.

Single file components should be like
```js
module.exports.install = container =>
  container.component(...)
```
_container_ is an inversio container instance.

## .component({name, factory, depends?, tags?, order?, ...}) -> Loader
Shorthand for registering a component the [inversio](https://www.npmjs.com/package/inversio) way.

## .component(...components) -> Loader
Register multiple components.

## .load() -> Promise(container)
Return [inversio](https://www.npmjs.com/package/inversio) container with all components registered.

# Example:
```js
// ./app/foo.comp.js
// single file component 'foo'
module.exports.install = container => container.component({
  name: 'foo',
  factory: () => new Bar()
})

// ./modules/module-x.js
// module referring to multiple components in modules/**/*.comp.js
module.exports = loader => loader.discover({
  cwd: __dirname,
  filter: '*.comp.js'
})

// index.js
var Loader = require('inversio-loader')

let container = await new Loader()
  .use(require('./modules/module-x.js'))
  .discover({
    cwd: './app',
    filter: '*.comp.js'
  })
  .load()

// resolve component
let foo = await container.resolve('foo') // -> instance of Bar
```
