/**
* @desc Route middleware.
*/
const Router = require("koa-router")
const router = new Router()

const controller = require('./start.controller.js')

router.get('/', async (ctx, next) => {
  await controller(ctx)
  await next()
})
router.get('/justhello', async (ctx, next) => {
  await controller(ctx)
  await next()
})

module.exports = router