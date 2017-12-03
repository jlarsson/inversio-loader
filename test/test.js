const Loader = require('../')
const tap = require('tap')

tap.test('happy path', async t => {
  // Create a loader with default discovery pattern
  let loader = new Loader({
    filter: '*.test-comp.js'
  })
  let container = await loader
    .use(require('./res/module'))
    .load()

  await container.resolve('a')
  t.pass('ok')
})
