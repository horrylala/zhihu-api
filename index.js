const Koa = require('koa')
const Router = require('koa-router')
const Http = require('http')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const path = require('path')
const app = new Koa()
const server = Http.createServer(app.callback())
const routes = require('./app/routes')
const socket = require('./app/socket')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const {CONNECTION } = require('./app/config')

mongoose.connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('mongose is connected'))
mongoose.connection.on('error', console.error)

app.use(error({
  postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

app.use(koaStatic(path.join(__dirname, '/public')))
app.use(koaBody({
  // 支持文件
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))
app.use(parameter(app))
routes(app)
socket(server)

server.listen(3000, () => {
  console.log('app is running at http://localhost:3000')
})