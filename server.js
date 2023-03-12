var http = require('http');
var fs = require('fs');
var path = require('path');

const PORT = 8082;

fs.readFile('./index.html', function(error, html) {
    if (error) throw error;
    http.createServer(function(request, response) {
        var filePath = '.' + request.url;
        if (filePath == './')
            filePath = './index.html';
        
        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
         case '.svg':
                contentType = 'image/svg+xml';
                break;        
        }
        
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end(); 
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }).listen(PORT);
});
