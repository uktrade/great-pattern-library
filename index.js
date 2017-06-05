const express = require('express')
const app = express()
const path = require('path')
const PROJECT_DIR = path.resolve(__dirname)
const pug = require('pug')
const fs = require('fs')

app.set('port', (process.env.PORT || 5000))

app.use(express.static(`${PROJECT_DIR}/static`))

// views is directory for all template files
app.set('views', 'backend/views')
app.set('view engine', 'pug')

app.get('/', function (request, response) {
  const partialsPath = `${PROJECT_DIR}/backend/views/partials`
  const templatePaths = {
    headers: {
      h1: `${partialsPath}/h1.pug`,
      h2: `${partialsPath}/h2.pug`,
      h3: `${partialsPath}/h3.pug`,
      h4: `${partialsPath}/h4.pug`
    },
    paragraphs: {
      'p': `${partialsPath}/p.pug`,
      'p--large': `${partialsPath}/p--large.pug`,
      'p--small': `${partialsPath}/p--small.pug`,
      'p--xsmall': `${partialsPath}/p--xsmall.pug`
    },
    links: {
      'a': `${partialsPath}/a.pug`
    },
    buttons: {
      'buttons--normal': `${partialsPath}/buttons.pug`,
      'buttons--large': `${partialsPath}/buttons--large.pug`,
      'buttons--transparent': `${partialsPath}/buttons--transparent.pug`
    }
  }
  // pre-render examples
  const renderComponentExample = function (sectionName, componentName) {
    let templatePath = templatePaths[sectionName][componentName]
    if (!this[sectionName]) {
      this[sectionName] = {}
    }
    this[sectionName][componentName] = pug.render(fs.readFileSync(templatePath, 'utf8'),
      {filename: templatePath})
  }
  let output = {}
  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(output, section))
  })

  response.render('pages/index', output)
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
