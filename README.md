# OUTDATED! Sque

**Instead use AWS' SDK: [aws-sdk-js](https://github.com/aws/aws-sdk-js/)**

Sque is painless interface to Amazons SQS, built for [node.js](http://nodejs.org).

## Status

**Current features:**

- 0.0.2 - SendMessage
- 0.0.2 - SendMessageBatch
- 0.0.1 - GetQueueAttributes
- 0.0.1 - ReceiveMessage
- 0.0.1 - DeleteMessage

**Feature roadmap:**

1. ListQueues / GetQueueUrl / CreateQueue / DeleteQueue / SetQueueAttributes
2. DeleteMessageBatch / ChangeMessageVisibility / ChangeMessageVisibilityBatch
3. AddPermission / RemovePermission

## Installation

    $ npm install sque

## Usage

```js
var Sque = require('sque');

// work with a specific queue:
var queue = Sque.getQueue({
  key      : '<AWS Key>',
  secret   : '<AWS Secret>',
  url      : '<AWS SQS queue url>'
});

/**
 * Queue attributes
 */

// get all queue attributes
queue.getAttributes(function( err, attributes ) {
  if ( err ) return console.log( err );
  console.log( attributes );
});

// get specific queue attribute
queue.getAttributes(['ApproximateNumberOfMessages'], function( err, attribute ) {
  if ( err ) return console.log( err );
  console.log( attribute );
});

// get multiple specific queue attributes
queue.getAttributes(['VisibilityTimeout', 'ApproximateNumberOfMessagesNotVisible'], function( err, attributes ) {
  if ( err ) return console.log( err );
  console.log( attributes );
});

/**
 * Queue subscription
 */

queue.subscribe({
  interval : 5000 // 5s polling interval; defaults to 10s if not sets
});

var messageCallback = function( message ) {
  console.log( 'queue message:' );
  console.dir( message );
  // ... do stuff with the message ...
  queue.deleteMessage( message.ReceiptHandle, function( err, success ) {
    if ( err ) return console.log( err );
    console.log( 'Hooray!' );
    console.dir( success );
  });
};
queue.on( 'message', messageCallback );

var messageErrorCallback = function( err ) {
  console.log( 'queue message error: ' );
  console.dir( err );
};
queue.on( 'message error', messageErrorCallback );

// unsubscribe
setTimeout(function() {
  queue.unsubscribe();
  queue.removeListener( 'message', messageCallback );
  queue.removeListener( 'message error', messageErrorCallback );
},20000);
```

## License

(The MIT License)

Copyright (c) 2014 mifitto GmbH <dominik@mifitto.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
