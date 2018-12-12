// Most of this code is based off of https://gist.github.com/hectorcorrea/2573391
// and https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

var port = 9000;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");
var checkMimeType = true;

//var driver_controller = require('../controllers/driverController');

console.log("Starting web server at " + serverUrl + ":" + port);

http.createServer( function(req, res) {

	var now = new Date();

	var filename = req.url || "index.html";
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	var validMimeType = true;
	var mimeType = validExtensions[ext];
	if (checkMimeType) {
		validMimeType = validExtensions[ext] != undefined;
	}

	if (validMimeType) {
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	}

}).listen(port, serverUrl);

function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

request.post(
  'driver_insert_post',{
    json: {}
  }
)

// app.post('driver_insert_post', urlencodedParser, function(req, res){
//   //Prepare output in JSON format
//   response = {
//     driver_id: req.query.driver_id,
//     driver_name: req.query.driver_name,
//     driver_lic_no: req.query.driver_lic_no,
//     trainer: req.query.trainer,
//     truck_id: req.query.truck_id
//   };
//   console.log(response);
//   res.end(JSON.stringify(response));
// })

// app.get('driver_insert_get', function(req, res){
//   //Prepare output in JSON format
//   response = {
//     driver_id: req.query.driver_id,
//     driver_name: req.query.driver_name,
//     driver_lic_no: req.query.driver_lic_no,
//     trainer: req.query.trainer,
//     truck_id: req.query.truck_id
//   };
//   console.log(response);
//   res.end(JSON.stringify(response));
// })
