/*Dependencies*/
var express = require('express');
var http = require('http');
var path = require('path');

/*Port number for webserver*/
const port = process.env.PORT;

/*Set server, app and socket.io up*/
var app = express();
var server = http.Server(app);

/*Assign port number to app*/
app.set('port', port);
/*Make ./static be available*/
app.use('/', express.static(__dirname + '/'));

/*On a request, send index.html over*/
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/*404 screen*/
app.get('*', function(req, res){
    res.status(404).send('<head><style>body {height: 98vh; background-color: black; display: flex; justify-content: center; align-items: center;}</style><title>That is an error</title></head><body><img width="70%"; src="//i.imgur.com/hMfpDQ9.png"></body>');
});

/*End of startup*/
server.listen(port, function(){
    console.log(`Started 5eTools server on port  ${port}.`);
});