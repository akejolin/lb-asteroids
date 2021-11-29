/**
* @desc Sets load order of server middlewares.
* @return array
*/
//const cors = require('koa-cors')
//const bearerToken = require('koa-bearer-token')
//const errorHandler = require('./error-handler')
//const notFoundHandler = require('./404')
//const bodyParser = require('koa-bodyparser')
const healthcheck = require('./system.healthcheck')
const respondToClient = require('./respond-to-client')
//const auth = require('./auth-jwt')

const corsWhiteList = [
  '*',
].join(' ')


module.exports = [
  //() => cors({
  //  origin: corsWhiteList
  //}),
  //() => errorHandler,
  //() => notFoundHandler,
  //() => bearerToken(),
  //() => bodyParser(),
  respondToClient,
  //auth,
  () => healthcheck,
]