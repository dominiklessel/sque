/*!
 * Sque
 * Copyright (c) 2012 rocket eleven GmbH <dominik@rocketeleven.de>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var _ = require( 'underscore' )._;

/**
 * Regex
 */

var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

/**
 * Returns the AWS `endpoint` of a given `string`
 *
 * @param {string} string
 * @return {string} url
 * @api private
 */

exports.getEndpoint = function( string ) {
  if ( !string ) throw new Error( '"String" required' );
  var parts = parse_url.exec( string ); // gives us: url, scheme, slash, host, port, path, query, hash
  return parts[3];
};

/**
 * Returns the `path` of a given `string`
 *
 * @param {string} string
 * @return {string} path
 * @api private
 */

exports.getPath = function( string ) {
  if ( !string ) throw new Error( '"String" required' );
  var parts = parse_url.exec( string ); // gives us: url, scheme, slash, host, port, path, query, hash
  return '/' + parts[5];
};

/**
 * Returns a normalized `results` object of a given `attributes` object
 *
 * @param {Object} attributes
 * @return {Object} results
 * @api private
 */

exports.refactorQueueAttributes = function( attributes ) {
  var results = {};
  if ( !_.isArray(attributes) ) {
    results[attributes['Name']] = attributes['Value'];
  }
  else {
    for ( var i = 0; i < attributes.length; i++ ) {
      var key = attributes[i]['Name'];
      var value = attributes[i]['Value'];
      results[key] = value;
    }
  }
  return results;
};

/**
 * Returns an id
 *
 * @return {String} id
 * @api private
 */

exports.generateId = function() {
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
  return id;
};