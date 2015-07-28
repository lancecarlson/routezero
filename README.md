# routezero

A very simple (and fast) web server that will route to ZeroMQ brokers. It behaves exactly like Mongrel2 in the sense that it uses the PUSH PULL and PUB SUB of ZeroMQ to fulfill requests.

## Run

```
node index.js
```

or using foreman:

```
foreman start
```

Some environment variables you can set (defaults shown):

```
HTTP_PORT=5000
PRODUCER_PORT=5555
SUBSCRIBER_PORT=5556
```

## Routes

Routezero exposes the express js routing capabilities and allows you to load up a routes.json file for setting up subscribers to topics. See routes.json for the default configuration. The basic format is as follows:

* method: can be get, post, put, delete, or all (just like express)
* path: any path that express js can handle ie: app.get(--path--)
* topic: the name of the topic workers should subscribe to separate their requests from others.