/**
* @desc Start page logics
*/

//const isEmpty = require('lodash.isempty')
//const get = require('lodash.get')

module.exports = async (ctx) => {
  ctx.respondToClient(ctx, 200 , `Hello world!`)
}