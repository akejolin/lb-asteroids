/**
* @desc App server.
* @return server - for supertests
*/

const koa = require("koa")
const serve = require('koa-static')
let port = process.env.PORT || 2222
const app = new koa()
const log = console //require('./utils/system.log')
app.use(serve(`${__dirname}/../build/`));

// Start server
const server = app.listen(port, () => {
  log.info(`Listening on port ${port}`)
})

module.exports = {
  server,
  setPort: (changeTo) => {
    port=changeTo
  }
}

