// Import the http library
var http = require('http');
var fs = require('fs');

var getAppHttp = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/html');
    fs.readFile(__dirname + '/playlist.html', function(err, data) {
        response.end(data);
    });
};
var getAppStylesheet = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');
    fs.readFile(__dirname + '/playlist.css', function(err, data) {
        response.end(data);
    });
};
var getMusicAppJS = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    fs.readFile(__dirname + '/music-app.js', function(err, data) {
        response.end(data);
    });
};
var getMusicDataJS = function(request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');
    fs.readFile(__dirname + '/music-data.js', function(err, data) {
        response.end(data);
    });
};
var getRedirect = function(request, response) {
    response.statusCode = 301;
    response.setHeader('Location', '/playlists');
    response.end();
};

// Create a server and provide it a callback to be executed for every HTTP request
// coming into localhost:3000.
var server = http.createServer();
server.on("request",function(request, response){
    response.statusCode = 200;
    // response.setHeader('Content-Type', 'text/plain');
    // response.write("Amazing Playlist diff");
    response.setHeader('Content-Type', 'text/html');
    fs.createReadStream("./playlist.html").pipe(response);
    response.end();

    //console.log(response);

    var method = request.method;
    var url = request.url;
    var headers = request.headers;
    var userAgent = headers['user-agent'];

    //console.log(method);

    // //get POST/PUT request Body
    // var body = [];
    // request.on('data', function(chunk) {
    //   body.push(chunk);
    // }).on('end', function() {
    //   body = Buffer.concat(body).toString();
    //   // at this point, `body` has the entire request body stored in it as a string
    // });

})



// Start the server on port 3000
server.listen(3000, function() {
    console.log('Amazing music app server listening on port 3000!')
});
