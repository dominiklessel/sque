/*!
 * Sque
 * Copyright (c) 2012 rocket eleven GmbH <dominik@rocketeleven.de>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var util         = require('util');

var _            = require( 'underscore' )._;
var aws          = require( 'aws-lib' );

var utils        = require( './utils' );

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Initialize a `Queue` with the given `url`.
 *
 * Required:
 *  - `key`     Amazon API key
 *  - `secret`  Amazon API secret
 *  - `url`     Queue url
 *
 * @param {string} url
 * @api public
 */

var Queue = function( options ) {
  if ( !options.key )    throw new Error( 'Amazon "API key" required' );
  if ( !options.secret ) throw new Error( 'Amazon "API secret" required' );
  if ( !options.url )    throw new Error( 'Amazon "Queue url" required' );

  EventEmitter.call(this);

  this.subscriptionActive = false;

  this.key      = options.key;
  this.secret   = options.secret;
  this.endpoint = utils.getEndpoint( options.url );
  this.path     = utils.getPath( options.url );
  this.client   = aws.createSQSClient( this.key, this.secret, { host : this.endpoint, path : this.path } );

};
util.inherits(Queue, EventEmitter);

/**
 * Returns one or all `attributes` of a queue with callback `fn( err, attributes )`.
 *
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} fn
 * @api public
 */

Queue.prototype.getAttributes = function( options, fn ) {
  var self = this;
  var reqParams = {};
  if ( 'undefined' == typeof fn ) {
    fn = options;
    options = [];
    reqParams['AttributeName.1'] = 'All';
  }
  else {
    for ( var i = options.length - 1; i >= 0; i-- ) {
      var key = 'AttributeName.' + ( i + 1 );
      var value = options[i];
      reqParams[key] = value;
    }
  }
  self.client.call( 'GetQueueAttributes', reqParams, function( err, attributes ) {
    if ( err ) return fn( err );
    attributes = attributes['GetQueueAttributesResult']['Attribute'];
    if ( 'undefined' == typeof attributes ) return fn( null, {} );
    return fn( null, utils.refactorQueueAttributes(attributes) );
  });
};

/**
 * Retrieves one `message` from the queue with callback `fn( err, message )`.
 *
 * @param {Function} callback
 * @return {Function} fn
 * @api private
 */

Queue.prototype.getMessage = function( fn ) {
  var self = this;
  var reqOptions = {
    MaxNumberOfMessages : 1
  };
  self.client.call( 'ReceiveMessage', reqOptions, function( err, _results ) {
    if ( err ) return fn( err );
    var results = [];
    // return if empty
    if ( _.isElement(_results['ReceiveMessageResult']['Message']) ) {
      return fn( null, results );
    }
    // check types
    if ( 'array' == typeof _results['ReceiveMessageResult']['Message'] ) {
      results = _results['ReceiveMessageResult']['Message'];
    }
    else if ( 'object' == typeof _results['ReceiveMessageResult']['Message'] ) {
      results.push( _results['ReceiveMessageResult']['Message'] );
    }
    // return results
    return fn( null, results );
  });
};

/**
 * Deletes a messages from the queue.
 *
 * @param {String} receiptHandle
 * @param {Function} callback
 * @return {Function} fn
 * @api public
 */

Queue.prototype.deleteMessage = function( receiptHandle, fn ) {
  var self = this;
  if ( !receiptHandle ) {
    return fn( new Error('"ReceiptHandle" required') );
  }
  var reqOptions = {
    ReceiptHandle : receiptHandle
  };
  self.client.call( 'DeleteMessage', reqOptions, function( err, _results ) {
    if ( err ) return fn( err );
    var results = _results;
    // return results
    return fn( null, results );
  });
};

/**
 * Starts the queue to constantly request `messages` with a given `interval`
 *
 * Optional:
 *   - `interval` Polling interval in ms; default : 10000
 *
 * @param {Object} options
 * @api public
 */

Queue.prototype.subscribe = function( options ) {
  var self = this;
  var interval = (options.interval) ? options.interval : 10000;
  var fetch = function () {
    self.getMessage( function( err, message ) {
      if ( err ) {
        self.emit('message error', { code : 500, msg : 'Failed to retrieve message.' });
      }
      else {
        if ( !_.isEmpty(message) ) self.emit('message', message[0] );
      }
      if ( self.subscriptionActive ) setTimeout( fetch, interval );
    });
  };
  fetch();
  self.subscriptionActive = true;
};

/**
 * Stops the queue from requesting `messages`
 *
 * @api public
 */

Queue.prototype.unsubscribe = function() {
  var self = this;
  self.subscriptionActive = false;
};

/**
 * Shortcut for `new Queue()`.
 *
 * @param {Object} options
 * @see Queue()
 * @api public
 */

exports.getQueue = function( options ) {
  return new Queue( options );
};