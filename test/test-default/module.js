/**
  * Modules typically just glob in their components
  * using the supplied loader
  */
module.exports = loader => loader.discover({cwd: __dirname})
