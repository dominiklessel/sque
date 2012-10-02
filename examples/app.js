var Sque = require('../');

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

// get specific queue attribute
queue.getAttributes(['VisibilityTimeout', 'ApproximateNumberOfMessagesNotVisible'], function( err, attributes ) {
  if ( err ) return console.log( err );
  console.log( attributes );
});

/**
 * Queue messages
 */

queue.subscribe({
  interval : 5000 // 5s polling interval; defaults to 10s if not sets
});

queue.on('message', function( message ) {
  console.log( 'queue message:' );
  console.dir( message );
  
  // ... do stuff with your message ...
  
  queue.deleteMessage( message.ReceiptHandle, function( err, success ) {
    if ( err ) return console.log( err );
    console.log( 'Hooray!' );
    console.dir( success );
  });

});

queue.on('message error', function( err ) {
  console.log( 'queue message error: ' );
  console.dir( err );
});

setTimeout(function(){
  queue.unsubscribe();
},20000);