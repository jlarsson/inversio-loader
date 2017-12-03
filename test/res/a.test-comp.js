/**
  * A component exports an install function which
  * allows for registration of components in supplied
  * container.
  */
module.exports.install = container => container.component({
  name: 'a',
  factory: () => ({
    tag: 'A',
    someInfo: 'test-component'
  })
})
