/*!
 * write-data <https://github.com/jonschlinkert/write-data>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var readYaml = require('read-yaml');
var writeData = require('..');
var del = require('delete');

var files = ['tmp/a.md', 'tmp/b.md', 'tmp/c.md', 'tmp/d.md', 'tmp/e.md'];

describe('sync', function () {
  it('should write a yaml file synchronously', function () {
    writeData.sync('test/actual/a.yml', {a: {b: {c: {d: 'e'}}}});
    var json = readYaml.sync('test/actual/a.yml');
    json.a.should.have.property('b');
    json.a.b.should.have.property('c');
  });

  it('should use specified indentation.', function () {
    writeData.sync('test/actual/b.yml', {a: {b: {c: {d: 'e'}}}}, {indent: 4});
    var str = fs.readFileSync('test/actual/b.yml', 'utf8');
    var secondLine = str.split('\n')[1];
    var indent = secondLine.match(/^(\s+)/)[0].split('').length;
    indent.should.equal(4);
  });
});

describe('async', function () {
  it('should write a yaml file asynchronously', function (cb) {
    writeData('test/actual/a.yml', {a: {b: {c: {d: 'e'}}}}, function (err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      var json = readYaml.sync('test/actual/a.yml');
      json.a.should.have.property('b');
      json.a.b.should.have.property('c');
      cb();
    });
  });

  it('should use specified indentation.', function (cb) {
    writeData('test/actual/b.yml', {a: {b: {c: {d: 'e'}}}}, {indent: 4}, function (err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      var str = fs.readFileSync('test/actual/b.yml', 'utf8');
      var secondLine = str.split('\n')[1];
      var indent = secondLine.match(/^(\s+)/)[0].split('').length;
      indent.should.equal(4);
      cb();
    });
  });
});

describe('write-json', function () {
  afterEach(function (cb) {
    del('actual', cb);
  });

  describe('async', function () {
    it('should write JSON asyncronously', function (cb) {
      var fixture = {foo: {bar: "baz"} };
      writeData('actual/test.json', fixture, function (err) {
        fs.readFile('actual/test.json', 'utf8', function (err, res) {
          if (err) return cb(err);
          assert.deepEqual(JSON.parse(res), fixture);
          cb();
        });
      });
    });
  });

  describe('sync', function () {
    it('should write JSON syncronously', function (cb) {
      var fixture = {foo: {bar: "baz"} };
      writeData.sync('actual/test.json', fixture);
      var res = fs.readFileSync('actual/test.json', 'utf8');
      assert.deepEqual(JSON.parse(res), fixture);
      cb();
    });
  });
});
