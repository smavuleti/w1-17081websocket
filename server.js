var WebSocketServer = require('websocket').server;
var http = require('http');



var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
  res.render('index')
});

app.listen(port, function() {
  console.log('Express App is running on port: '+port);
});


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3000, function() {
    console.log((new Date()) + 'HTTP Server is listening on port 3000');
});

// Create Websocket Server
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' 
                   + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    // Case 1: receive message from the client
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF("I am fine!");
            console.log("I am fine!");
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' 
                         + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    // Case 2: close the connection
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' 
                   + connection.remoteAddress + ' disconnected.');
    });
});