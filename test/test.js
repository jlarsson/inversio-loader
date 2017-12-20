const Loader = require('../')
const tap = require('tap')
const path = require('path')

tap.test('happy path', async t => {
  // Create a loader with default discovery pattern
  let loader = new Loader({
    filter: '*.test-comp.js'
  })
  let container = await loader
    .use(require('./test-default/module'))
    .load()

  await container.resolve('a')
  t.pass('ok')
})

tap.test('create()', async t => {
  let loader = require('../').create
  let container = await
    loader({
      filter: '*.test-comp.js'
    })
    .use(require('./test-default/module'))
    .load()

  await container.resolve('a')
  t.pass('ok')
})

tap.test('use custom method for registration', async t => {
  let loader = require('../').create
  let container = await
    loader({
      install (path, container) {
        return require(path).customSetup(container)
      },
      filter: '*.custom-comp.js'
    })
    .discover({
      cwd: path.join(__dirname, '/test-custom')
    })
    .load()

  await container.resolve('custom-a')
  t.pass('ok')
})
