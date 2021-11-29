/**
* @desc Server healthcheck.
*/

const regExp = /healthcheck/i
module.exports = async (ctx, next) => {
  if (regExp.test(ctx.request.url)) {
    ctx.status = 204
    return
  }

  await next()
}
