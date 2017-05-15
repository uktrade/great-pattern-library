const express = require('express')
const app = express()
const path = require('path')
const PROJECT_DIR = path.resolve(__dirname)

app.set('port', (process.env.PORT || 5000))

app.use(express.static(`${PROJECT_DIR}/static`))
app.use(express.static(__dirname + '/node_modules'))

// views is directory for all template files
app.set('views', 'backend/views')
app.set('view engine', 'pug')

app.get('/', function (request, response) {
  response.render('pages/index')
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
