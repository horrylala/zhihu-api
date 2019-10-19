const Router = require('koa-router')
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt')
const usersRouter = new Router({prefix: '/users'})
const { find, findById, create, update, delete: del, login } = require('../controllers/users')
const { SECRET } = require('../config')

// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//      const user = jsonwebtoken.verify(token, SECRET)
//      ctx.state.user = user
//   } catch (e) {
//     ctx.throw(401, e.message)
//   }
//   await next()
// }

const auth = jwt({secret: SECRET})

const checkOwner = async (ctx, next) => {
  if (ctx.params.id !== ctx.state.user._id) {
    ctx.throw(403, '没有权限')
  }
  next()
}

usersRouter.get('/', find)
usersRouter.post('/', create)
usersRouter.get('/:id', findById)
usersRouter.patch('/:id', auth, update)
usersRouter.delete('/:id', auth, checkOwner, del)
usersRouter.post('/login', login)

module.exports = usersRouter