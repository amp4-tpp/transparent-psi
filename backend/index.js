'use strict'

const express = require('express');
const session = require('express-session');
const uuidv4 = require('uuid/v4');
const user = require('./src/user');
const cors = require('cors');
const bodyParser = require('body-parser');
const save = require('./src/save');


const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(bodyParser.json());

app.use(session({
  secret: 'psi project',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

app.get('/', (req, res) => {
  req.session.secureId = req.session.secureId || uuidv4();
  res.json(user.getUser(req));
});

app.get('/ping/:erotic/:nonErotic', (req, res) => {
  req.session.secureId = req.session.secureId || uuidv4();
  res.json(user.getUser(req, req.params.erotic, req.params.nonErotic));
});

app.post('/', (req, res) => {
  save.save(req.body, req.get('User-Agent'))
  res.json(req.body);
});

app.get('/pic/:type', (req, res) => {
  res.json({
    status: "ok",
    urls: user.getPicByType(req.params.type)
  });
});

app.get('/shamPic/:type', (req, res) => {
  res.json({
    status: "ok",
    urls: user.getShamPicByType(req.params.type)
  });
});

app.get('/lang/:lang', (req, res) => {
  res.json({
    status: "ok",
    texts: user.getLang(req.params.lang)
  });
});

app.get('/langs', (req, res) => {
  res.json({
    status: "ok",
    langs: user.getLangs()
  });
});

app.get('/checkId/:labId/:expId', (req, res) => {
  res.json({
    status: "ok",
    valid: user.idCheck(req.params.labId, req.params.expId)
  });
});

app.get('/saveId/:labId/:expId/:labScore/:expScore', (req, res) => {
  res.json({
    status: "ok",
    saved: user.saveId(req.params.labId, req.params.expId, req.params.labScore, req.params.expScore)
  });
});

app.get('/getAllId', (req, res) => {
  res.json({
    status: "ok",
    saved: user.getAllId()
  });
});

module.exports = app;
