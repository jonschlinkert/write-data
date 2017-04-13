/*!
 * write-data <https://github.com/jonschlinkert/write-data>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var readYaml = require('read-yaml');
var writeData = require('..');
var del = require('delete');

var files = ['tmp/a.md', 'tmp/b.md', 'tmp/c.md', 'tmp/d.md', 'tmp/e.md'];

describe('write-data', function() {
  afterEach(function(cb) {
    del('actual', cb);
  });

  describe('json / async', function() {
    it('should throw on invalid extensions', function(cb) {
      var fixture = {foo: {bar: "baz"} };
      writeData('actual/test.txt', fixture, function(err) {
        assert(err);
        assert(/unsupported/.test(err.message));
        cb();
      });
    });

    it('should write JSON asyncronously', function(cb) {
      var fixture = {foo: {bar: "baz"} };
      writeData('actual/test.json', fixture, function(err) {
        fs.readFile('actual/test.json', 'utf8', function(err, res) {
          if (err) return cb(err);
          assert.deepEqual(JSON.parse(res), fixture);
          cb();
        });
      });
    });
  });

  describe('yaml / async', function() {
    it('should write a yaml file asynchronously', function(cb) {
      var data = {a: {b: {c: {d: 'e'}}}};
      writeData('test/actual/a.yml', data, function(err) {
        if (err) {
          cb(err);
          return;
        }
        var json = readYaml.sync('test/actual/a.yml');
        assert(json.a.hasOwnProperty('b'));
        assert(json.a.b.hasOwnProperty('c'));
        cb();
      });
    });

    it('should use specified indentation.', function(cb) {
      var data = {a: {b: {c: {d: 'e'}}}};
      writeData('test/actual/b.yml', data, {indent: 4}, function(err) {
        if (err) {
          cb(err);
          return;
        }
        var str = fs.readFileSync('test/actual/b.yml', 'utf8');
        var secondLine = str.split('\n')[1];
        var indent = secondLine.match(/^(\s+)/)[0].split('').length;
        assert.equal(indent, 4);
        cb();
      });
    });
  });

  describe('json / sync', function() {
    it('should throw on invalid extensions', function() {
      assert.throws(function() {
        writeData.sync('foo.txt', {});
      }, /unsupported/);
    });

    it('should write JSON syncronously', function() {
      var fixture = {foo: {bar: "baz"} };
      writeData.sync('actual/test.json', fixture);
      var res = fs.readFileSync('actual/test.json', 'utf8');
      assert.deepEqual(JSON.parse(res), fixture);
    });
  });

  describe('yaml / sync', function() {
    it('should write a yaml file synchronously', function() {
      writeData.sync('test/actual/a.yml', {a: {b: {c: {d: 'e'}}}});
      var json = readYaml.sync('test/actual/a.yml');
      assert(json.a.hasOwnProperty('b'));
      assert(json.a.b.hasOwnProperty('c'));
    });

    it('should use specified indentation.', function() {
      writeData.sync('test/actual/b.yml', {a: {b: {c: {d: 'e'}}}}, {indent: 4});
      var str = fs.readFileSync('test/actual/b.yml', 'utf8');
      var secondLine = str.split('\n')[1];
      var indent = secondLine.match(/^(\s+)/)[0].split('').length;
      assert.equal(indent, 4);
    });
  });
});
