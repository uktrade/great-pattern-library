const express = require('express')
const app = express()
const path = require('path')
const PROJECT_DIR = path.resolve(__dirname)
const pug = require('pug')
const fs = require('fs')
const beautifyHtml = require('js-beautify').html

const oPackage = require('./package.json')
const partialsPath = `${PROJECT_DIR}/backend/views/partials`
const patternsPath = `${PROJECT_DIR}/backend/views/patterns`
const {version} = oPackage
const getBaseContext = function () {
  return {version}
}
// pre-render examples
const renderComponentExample = function (templatePaths, sectionName, componentName) {
  let templatePath = templatePaths[sectionName][componentName]
  if (!this[sectionName]) {
    this[sectionName] = {}
  }
  this[sectionName][componentName] = beautifyHtml(
    pug.render(
      fs.readFileSync(templatePath, 'utf8'),
      {filename: templatePath}
    )
  )
}
app.set('port', (process.env.PORT || 5000))

app.use(express.static(`${PROJECT_DIR}/static`))

// add request to context
app.use(function (req, res, next) {
  res.locals.req = req
  next()
})

// views is directory for all template files
app.set('views', 'backend/views')
app.set('view engine', 'pug')

app.get('/', function (request, response) {
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

  let context = getBaseContext()
  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(context, templatePaths, section))
  })
  response.render('pages/index', context)
})

app.get('/colours-typography', function (request, response) {
  const templatePaths = {
    headers: {
      h1: `${partialsPath}/h1.pug`,
      h2: `${partialsPath}/h2.pug`,
      h3: `${partialsPath}/h3.pug`,
      h4: `${partialsPath}/h4.pug`
    },
    paragraphs: {
      'p': `${partialsPath}/p.pug`,
      'p--lead': `${partialsPath}/p--lead.pug`,
      'p--large': `${partialsPath}/p--large.pug`,
      'p--small': `${partialsPath}/p--small.pug`,
      'p--xsmall': `${partialsPath}/p--xsmall.pug`
    },
    quotes: {
      'blockquote': `${partialsPath}/blockquote.pug`
    }
  }

  let context = getBaseContext()
  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(context, templatePaths, section))
  })
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/colour-typography', context)
})

app.get('/links-buttons', function (request, response) {
  const templatePaths = {
    links: {
      'a': `${partialsPath}/a.pug`
    },
    buttons: {
      'buttons--normal': `${partialsPath}/buttons.pug`,
      'buttons--large': `${partialsPath}/buttons--large.pug`,
      'buttons--transparent': `${partialsPath}/buttons--transparent.pug`
    }
  }

  let context = getBaseContext()
  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(context, templatePaths, section))
  })
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/links-buttons', context)
})

app.get('/layout-breakpoints', function (request, response) {
  let context = getBaseContext()
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/layout-breakpoints', context)
})

app.get('/forms-inputs', function (request, response) {
  let context = getBaseContext()
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/forms-inputs', context)
})

app.get('/blocks-media', function (request, response) {
  const templatePaths = {
    panels: {
      'panel--no-border': `${partialsPath}/blocks/panel--no-border.pug`
    }
  }
  let context = getBaseContext()

  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(context, templatePaths, section))
  })
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/blocks-media', context)
})

app.get('/patterns', function (request, response) {
  const templatePaths = {
    patterns: {
      typography: `${patternsPath}/typography.pug`,
      header: `${patternsPath}/header.pug`,
      footer: `${patternsPath}/footer.pug`,
      steps: `${patternsPath}/steps.pug`,
      stepsOnGrid: `${patternsPath}/steps--on-grid.pug`,
      chevrons: `${patternsPath}/chevrons.pug`
    }
  }

  let context = getBaseContext()
  // go through template paths sections and populate output
  Object.getOwnPropertyNames(templatePaths).forEach(section => {
    Object.getOwnPropertyNames(templatePaths[section]).forEach(renderComponentExample.bind(context, templatePaths, section))
  })
  // let templatePath = `${patternsPath}/typography.pug`
  response.render('pages/patterns', context)
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
