'use strict';

const test = require('tape');
const request = require('supertest');
const app = require('../index');
const user = require('../src/user');

test('stored id ', (t) => {
  request(app)
    .get('/')
    .expect(200)
    .end(function (err, res) {
      const responseId = res.body.id;
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          t.notEqual(res.body.id, responseId, 'should be different id');
          t.end();
          });
      });
});

test('pic or didn`t happened', (t) => {
  let options = ['mm', 'ff', 'fm', 'mf'];
  let picNum = 36;
  options.forEach(function(type){
    request(app)
      .get('/pic/' + type)
      .expect(200)
      .end(function (err, res) {
        t.same(res.body.status, 'ok', 'get ' + type);
        t.same(res.body.urls.length, picNum, picNum + ' available in ' + type)
      });
  });
  t.end();
});

test('english motherf* you speak it', (t) => {
  let options = ['1_English', '2_Magyar'];
  options.forEach(function(type){
    request(app)
      .get('/lang/' + type)
      .expect(200)
      .end(function (err, res) {
        t.same(res.body.status, 'ok', 'get ' + type);
        t.true(res.body.texts)
      });
  });
  t.end();
});

test('unsupported lang', (t) => {
  let options = ['klingon', 'alma', ';'];
  options.forEach(function(type){
    request(app)
      .get('/lang/' + type)
      .expect(200)
      .end(function (err, res) {
        t.same(res.body.status, 'ok', 'not get ' + type);
        t.false(res.body.texts)
      });
  });
  t.end();
});

test('available langs', (t) => {
  request(app)
    .get('/langs')
    .expect(200)
    .end(function (err, res) {
      t.same(res.body.status, 'ok', 'status is ok');
      t.true(Array.isArray(res.body.langs), 'should return an array')
      t.true(res.body.langs.length > 1)
    });
  t.end();
});

test('user is valid', (t) => {
  let sideOptions = ["left", "right"]
  let mockReq = { session: { secureId: 5 } }
  let tempUser =  user.getUser(mockReq);
  t.same(tempUser.id, 5)
  t.ok(sideOptions.includes(tempUser.side), "valid user side")
  t.end();
});


test('lang feature integration', (t) => {
  var langs = []
  request(app)
    .get('/langs')
    .expect(200)
    .end(function (err, res) {
      res.body.langs.forEach(function(type){
        request(app)
          .get('/lang/' + type)
          .expect(200)
          .end(function (err, res) {
            t.same(res.body.status, 'ok', 'get ' + type);
            t.true(res.body.texts)
          });
      });
    });
    t.end();
});

test('good id check', (t) => {
  request(app)
    .get('/checkId/testLab/testExp')
    .expect(200)
    .end(function (err, res) {
      t.same(res.body.status, 'ok', 'status is ok');
      t.true(res.body.valid)
    });
  t.end();
});

test('bad id check', (t) => {
  request(app)
    .get('/id/badLab/badID')
    .expect(200)
    .end(function (err, res) {
      t.same(res.body.status, 'ok', 'status is ok');
      t.false(res.body.valid)
    });
  t.end();
});
