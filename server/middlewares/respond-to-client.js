/**
* @desc Attach response to client function koa application context
* @param object $app - koa application
* @return void
*/

const REST_CODES = require('./rest-codes')

const respondToClient = (ctx, status=200, data=null) => {
  let statusCode = status
  let output = data
  if (typeof statusCode !== 'number') {
    output = statusCode
    statusCode = 200
  }

  if (typeof status === 'number' && data === null) {
    output = REST_CODES[statusCode]
  }
  const errorRegExp = /[45][01][0123456789]/
  if (errorRegExp.test(`${statusCode}`)) {
    output = {
      ...{error: output},
      ...{status: statusCode}
    }
  }

  if (typeof output !== 'object') {
    output = {response: output}
  }
  ctx.status = statusCode
  ctx.body = output
}

module.exports = (app) => {
  app.context.respondToClient = respondToClient
  return (ctx, next) => next()
}
