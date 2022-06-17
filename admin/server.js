'use strict'

var express = require('express');
var path = require('path');
var https = require('https')

var fs = require('fs')

var app = express();

app.use('/assets', express.static('./assets'))

app.get('/99754106633f94d350db34d548d6091a', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/assets/index.html'));
})

const createProdApp = app => {
  const hskey = fs.readFileSync('key.pem');
  const hscert = fs.readFileSync('cert.pem')
  const options = {
      key: hskey,
      cert: hscert
  };
  return https.createServer(options,app)
}

const server = process.argv.includes('prod') ? createProdApp(app) : app;

server.listen(8083);
