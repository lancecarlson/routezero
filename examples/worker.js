// worker.js
var zmq = require('zmq'),
    puller = zmq.socket('pull'),
    publisher = zmq.socket('pub');

puller.connect('tcp://127.0.0.1:5555');
console.log('Worker puller connected to port 5555');
publisher.connect('tcp://127.0.0.1:5556');
console.log('Worker publisher connected to port 5556');

puller.on('message', function(msg){
  var req = JSON.parse(msg);
  console.log('work: %s', msg.toString());
  var body = 'hello world!<br />';
  body += JSON.stringify(req);
  publisher.send(['all', JSON.stringify({id: req.id, body: body})]);
});
