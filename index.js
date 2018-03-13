var serve = require('express');
var path = require('path');
var app = serve();
var nodemailer = require('nodemailer');
var fs = require('fs');
app.use(serve.static('public'));
app.use('', serve.static(path.join(__dirname + '')));
app.set('port', (process.env.PORT || 5000));
app.get('/', function(req, res, next){
	res.sendFile((path.join(__dirname+'/gdg.html')));
});
var server = (app).listen(app.get('port'), function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("running\n");
    console.log("host working"+host+"\n");
    console.log("port working on" +port);
});