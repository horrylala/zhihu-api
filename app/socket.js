const Socket = require('socket.io')

module.exports = (server) => {
  const io = new Socket(server)

  const roll = io
    .of('/roll')
    .on('connection', (socket) => {
      console.log('connected')
    })
    .on('disconnect', () => {
      console.log('disconnect')
    })
  let cnt = 0
  const list = []
  setInterval(() => {
    if (cnt < 400) {
      // 发送新消息
      roll.emit('new message', {
        data: [{
          mobile: '1232138821',
          giftName: '飞机' + (cnt++)
        },
        {
          mobile: '1232138821',
          giftName: '飞机' + (cnt++)
        }
      ]
      })
    }
  }, 20000)
}