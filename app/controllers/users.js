// const db = [{name: 'lilei'}]
const jsonwebtoken = require('jsonwebtoken')
const User = require('../modules/users')
const { SECRET } = require('../config')

class UsersCtl {
  async find (ctx) {
    ctx.body = await User.find()
  }

  async findById (ctx) {
    // fileds
    ctx.status = 200
    const { fileds } = ctx.query
    const handledFileds = fileds && fileds.split(';').filter(f => f).join('+')
    const user = await User.findById(ctx.params.id).select(`+${handledFileds}`)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
      avatar_url: { type: 'string', required: true },
      gender: { type: 'string', required: false },
      headline: {type: 'string', required: false  },
      locations: { type: 'array', itemType: 'string', required: false }
    })
    const { name } =ctx.request.body
    const requestUser = await User.findOne({name})
    if (requestUser) { ctx.throw(409, '用户已存在') }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false},
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: true },
      gender: { type: 'string', required: false },
      headline: {type: 'string', required: false  },
      locations: { type: 'array', itemType: 'string', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user
  }

  async delete (ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.status = 204
  }

  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true},
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或者密码不正确')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({_id, name}, SECRET, { expiresIn: '1d' })
    ctx.body =  { token }
  }
}

module.exports = new UsersCtl()