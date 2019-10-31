var mockServer = require('node-mock-server')
console.log('没有执行吗')
mockServer({
  restPath: './api',
  dirName: __dirname,
  urlPath: '/api',
  port: 3001,
  open: false
})
