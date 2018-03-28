var serve = require('express');
var path = require('path');
var app = serve();
var nodemailer = require('nodemailer');
var fs = require('fs');
app.use(serve.static('public'));
app.use('', serve.static(path.join(__dirname + '')));
app.set('port', (process.env.PORT || 5000));
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'ngudbhavtest@outlook.com',
        pass: 'NGUdbhav'
    }
});
app.get('/', function(req, res, next){
	res.sendFile((path.join(__dirname+'/gdg.html')));
});
app.get('/getForm', function(req, res, next){
    const db = require('./db.js');
    db.query('Select name from formid where id = ?', [req.query.id], function(error, results){
        if(error){
            console.log(error);
            res.send("0");
        }
        else{
            res.send(results[0].name);
        }
    });
});
app.get('/registration', function(req, res, next){
    var parti = 0;
    if(req.query.second === ''){
        parti = req.query.enroll;
    }
    else if(req.query.third === ''){
        parti = req.query.enroll + '+' + req.query.second;
    }
    else if(req.query.fourth === ''){
        parti = req.query.enroll + '+' + req.query.second + '+' + req.query.third;
    }
    else{
        parti = req.query.enroll + '+' + req.query.second + '+' + req.query.third + '+' + req.query.fourth;
    }
    const db = require('./db.js');
    db.query('insert into stud values(?, ?, ?, ?, ?, ?)', [req.query.enroll, req.query.name, req.query.phone, req.query.email, req.query.ishome, req.query.year], function(error, results){
        if(error){
            if(error.code === 'ER_DUP_ENTRY'){}
            else{
                console.log(error);
                res.end("0");
            }
        }
            if(req.query.ishome === 3){
                db.query('insert into otherCollege values(?, ?)', [req.query.enroll, req.query.collegename], function(error, results){
                    if(error){
                        if(error.code === 'ER_DUP_ENTRY'){}
                        else{
                            console.log(error);
                            res.send("0");
                        }
                    }
                });
            }    
            db.query('select teamid from part order by teamid desc', function(error, results){
                if(error){
                    console.log(error);
                    res.send("0");
                }
                else{
                    var count = 0;
                    db.query('Select participants from part where formid = ?', [req.query.whichForm], function(error, results){
                        if(error){
                            console.log(error);
                            res.send("0");
                        }
                        else{
                            if(results.length !== 0){
                                for(var i in results){
                                    if(results[i].participants === parti){
                                        res.end("3");
                                        count = 1;
                                    }
                                }
                            }
                        }
                    });
                    if(count === 0){
                        var teamid = parseInt((results[0].teamid).replace(/[^0-9\.]/g, ''), 10);
                        teamid = "Cyber" + (teamid+1);
                        db.query('insert into part values(?, ?, ?, ?)', [teamid, req.query.participants, parti, req.query.whichForm], function(error, results){
                            if(error){
                                console.log(error);
                                res.send("0");
                            }
                            else{
                                res.send(teamid);
                                console.log(teamid);
                            }
                        });
                    }
                }
            });
    });
});
app.get('/getDetails', function(req, res, next){
    const db = require('./db.js');
    if(true){
    db.query('Select * from stud where enroll = ?', [req.query.enroll], function(error, results){
        if(error){
            console.log(error);
            res.send("0");
        }
        else{
            res.send(results);
        }
    });
}
});
app.get('/contact', function(req, res, next){
	var mailOptions = {
    	from: 'ngudbhavtest@outlook.com',
    	to: 'ngudbhav05@hotmail.com',
    	subject: 'Feedback my wesbite',
    	text: 'Hello '+req.query.name+ ' '+ req.query.message + ' by '+req.query.email
	};
	transporter.sendMail(mailOptions, function(error, info){
    	if(error){
        	console.log(error);
        	res.send("0");
    	}
    	else{
    		console.log('Message sent: ' + info.response);
    		res.send("1");
    	}
	});
});
var server = (app).listen(app.get('port'), function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("running\n");
    console.log("host working"+host+"\n");
    console.log("port working on" +port);
});