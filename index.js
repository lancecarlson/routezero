var express = require('express'),
    logger = require('morgan'),
    uuid = require('node-uuid'),
    zmq = require('zmq'),
    producer = zmq.socket('push'),
    subscriber = zmq.socket('sub');

var app = express();
var ports = {
  http: process.env.HTTP_PORT || 5000,
  producer: process.env.PRODUCER_PORT || 5555,
  subscriber: process.env.SUBSCRIBER_PORT || 5556
};

app.listen(ports.http, function() {
  console.log("Listening on " + ports.http);
})

app.use(logger('combined'));

producer.bindSync('tcp://127.0.0.1:' + ports.producer);
console.log('Producer bound to port ' + ports.producer);
subscriber.bindSync('tcp://127.0.0.1:' + ports.subscriber);
console.log('Subscriber bound to port ' + ports.subscriber);

var resQueue = {};

subscriber.on('message', function(topic, message) {
  var message = JSON.parse(message);
  var res = resQueue[message.id];
  delete resQueue[message.id];
  res.send(message.body);
});

var parseReq = function(req) {
  return {
    id: uuid.v1(),
    headers: req.headers,
    method: req.method,
    domain: req.domain,
    protocol: req.protocol,
    query: req.query,
    url: req.url,
    http_version: req.httpVersion,
    params: req.params
  };
};

var onRoute = function(req, res) {
  var qreq = parseReq(req);
  resQueue[qreq.id] = res;
  producer.send(JSON.stringify(qreq));
};

var createRoute = function(method, route, topic) {
  subscriber.subscribe(topic);
  app[method](route, onRoute);
};

var routePath = process.env.ROUTE_CONFIG_PATH || './routes.json';
var Routes = require(routePath);

Routes.forEach(function(route, i) {
  createRoute(route.method, route.path, route.topic);
});
