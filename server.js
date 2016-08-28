require('babel-register')

const React = require('react')
const ReactDOMServer = require('react-dom/server')
const _ = require('lodash')
const fs = require('fs')
const baseTemplate = fs.readFileSync('./index.html')
const template = _.template(baseTemplate)
const ZipForm = require('./js/ZipForm.jsx')

const port = process.env.PORT || 9191
const express = require('express')

const app = express()

app.use('/public', express.static('./public'))

app.use('/', (err, res) => { 
  const body = ReactDOMServer.renderToString(React.createElement(ZipForm, {}))

  res.status(200).send(template({ body }))
})

console.log('Express server listening on port: ', port)
app.listen(port)
