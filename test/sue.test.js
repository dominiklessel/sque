// module dependencies
var sque  = require('../lib/sque');
var nconf = require('nconf');

// load config file
nconf.file({ file: './test/config.json' });

// global var
var queue;

describe('sque', function () {

  describe('getQueue()', function() {
    it('should init without errors', function( done ) {
      queue = sque.getQueue({
        key      : nconf.get('AWS:Key'),
        secret   : nconf.get('AWS:Secret'),
        url      : nconf.get('Queue')
      });
      done();
    });
  });

  describe('getAttributes()', function() {
    it('should finish without errors', function( done ) {
      queue.getAttributes( done );
    });
  });

  describe('getMessage()', function() {
    it('should finish without errors', function( done ) {
      queue.getMessage( done );
    });
  });

  describe('sendMessage()', function() {
    it('should save without errors', function( done ) {
      queue.sendMessage({ foo : 'bar' }, done);
    });
  });

  describe('sendMessages()', function() {
    it('should save without errors', function( done ) {
      queue.sendMessages([{ foo : 'bar' }, { bar : 'foo' }], done);
    });
  });

});