'use strict';

const fs = require('fs')

const https = require('https')

const app = require('./index');
const port = process.env.PORT || 8085;

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

server.listen(port, () => {
  console.log('Server running on port %d', port);
});
