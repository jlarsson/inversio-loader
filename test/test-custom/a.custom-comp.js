/**
  * A component exports an install function which
  * allows for registration of components in supplied
  * container.
  */
module.exports.customSetup = container => container.component({
  name: 'custom-a',
  factory: () => ({
    tag: 'A',
    someInfo: 'test-component'
  })
})
