class HomeCtl {
  index (ctx) {
   ctx.body = 'hello world 123'
  }
  upload (ctx) {}
}

module.exports = new HomeCtl()