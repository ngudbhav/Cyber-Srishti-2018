var serve = require('express');
var path = require('path');
var app = serve();
var http = require('http');
var https = require('https');
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
var privateKey  = fs.readFileSync('ssl/private.key', 'utf8');
var certificate = fs.readFileSync('ssl/certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var cyberTransport = nodemailer.createTransport({
    host: "smtpout.asia.secureserver.net",
    secureConnection: false,
    port: 3535,
    auth: {
        user: 'info@cybersrishti.com',
        pass: 'Cyber@21'
    }
});
app.get('/', function(req, res, next){
	res.status(200);
	res.sendFile((path.join(__dirname+'/gdg.html')));
});
app.get('/admin', function(req, res, next){
	res.sendFile(path.join(__dirname+'/adminPanel.html'));
});
app.get('//admin', function(req, res, next){
    res.redirect('/admin');
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
app.get('/enrollDetails', function(req, res, next){
    var enroll = req.query.enroll;
    const db = require('./db.js');
    db.query('Select * from stud where enroll = ?', [enroll], function(error, results){
        if(error){
            console.log(error);
            res.send("0");
        }
        else{
            res.send(results);
        }
    })

});
app.get('/accomodation', function(req, res, next){
    var name = req.query.name;
    var email = req.query.email;
    var college = req.query.college;
    var phone = req.query.phone;
    var address = req.query.address;
    const db = require('./db.js');
    db.query('Insert into accomodation values(?, ?, ?, ?, ?)', [name, email, phone, college, address], function(error, results){
        if(error){
            if(error.code === 'ER_DUP_ENTRY'){
                res.send("3");
            }
            else{
                console.log(error);
                res.end("0");
            }
        }
        else{
            res.send("1");
            var mailOptions = {
                from: 'info@cybersrishti.com',
                to: email+', info@cybersrishti.com',
                subject: 'Registration of Accomodation @ Cyber-Srishti',
                html: '<b>Welcome to Cyber-Srishti.</b><br><br> Thank You for your registration for the accomodation at Cyber-Srishti. <br><br><b>Here are your details we have<br>'+name+'<br>'+email+'<br>'+phone+'<br>'+college+'<br>'+address+'</b>.<br><br> Please keep your TeamID with you at the event. If you see that you have recieved the mail in error, please contact us. Also, please don\'t reply to the above email address. Thank You'
            };
            cyberTransport.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Message sent: ' + info.response);
                }
            });

        }
    });
});
app.get('/adminaccess', function(req, res, next){
	const db = require('./db.js');
    console.log(req.query.eId);
	db.query('Select * from formid where id=? and pass=?', [req.query.eId, req.query.password], function(error, results){
		if(error){
			console.log(error);
			res.send("0");
		}
		else{
			if(results.length===0){
				res.send("1");
			}
			else{
                if(req.query.eId !=24){
				    db.query('select * from stud,part where formid = ? and (stud.enroll = left(part.participants, instr(part.participants, "+")-1) or stud.enroll = left(part.participants, 10))', [req.query.eId], function(error, results){
					   if(error){
						  console.log(error);
						  res.send("0");
					   }
					   else{
						  if(results.length === 0){
						      res.send("4");
						  }
						  else{
                                var e = results;
                                res.send(e);
						  }
					   }
				    });
                }
                else{
                    console.log('h');
                    db.query('Select * from accomodation', function(error, results){
                        if(error){
                            console.log(error);
                            res.send("0");
                        }
                        else{
                            console.log(results);
                            if(results.length === 0){
                                res.send("4");
                            }
                            else{
                                res.send(results);
                            }
                        }
                    });
                }
			}
		}
	});
});
app.get('/registration', function(req, res, next){
	var enroll = req.query.enroll;
	if(req.query.enroll === ''){
		enroll = req.query.phone;
	}
    var parti = 0;
    if(req.query.second === ''){
        parti = enroll;
    }
    else if(req.query.third === ''){
        parti = enroll + '+' + req.query.second;
    }
    else if(req.query.fourth === ''){
        parti = enroll + '+' + req.query.second + '+' + req.query.third;
    }
    else{
        parti = enroll + '+' + req.query.second + '+' + req.query.third + '+' + req.query.fourth;
    }
    const db = require('./db.js');
    db.query('insert into stud values(?, ?, ?, ?, ?, ?)', [enroll, req.query.name, req.query.phone, req.query.email, req.query.ishome, req.query.year], function(error, results){
        if(error){
            if(error.code === 'ER_DUP_ENTRY'){}
            else{
                console.log(error);
                res.end("0");
            }
        }
        if(req.query.ishome == 3){
            db.query('insert into otherCollege values(?, ?)', [enroll, req.query.collegename], function(error, results){
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
                var teamid = parseInt((results[0].teamid).replace(/[^0-9\.]/g, ''), 10);
                console.log(count);
                if(count === 0){
                    teamid = "Cyber" + (teamid+1);
                    var formid = req.query.whichForm;
                    var formName = '';
                    db.query('Select name from formid where id = ?', [formid], function(error, results){
                        if(error){
                            console.log(error);
                            res.send("0");
                        }
                        else{
                            formName = results[0].name
                            db.query('insert into part values(?, ?, ?, ?)', [teamid, req.query.participants, parti, req.query.whichForm], function(error, results){
                                if(error){
                                    if(error.code === 'ER_DUP_ENTRY'){
                                        console.log(error);
                                        res.send("3");
                                    }
                                }
                                else{
                                    res.send(teamid);
                                    var mailOptions = {
                                        from: 'info@cybersrishti.com',
                                        to: req.query.email,
                                        subject: 'Registration @ Cyber-Srishti',
                                        html: '<b>Welcome to Cyber-Srishti.</b><br><br> Thank You for your registration at the event of Cyber-Srishti. <br><br><b>Your team ID for the event  '+formName+'  is' + teamid + '</b>.<br><br> Please keep it with you at the event. If you see that you have recieved the mail in error, please contact us. Also, please don\'t reply to the above email address. Thank You'
                                    };
                                    cyberTransport.sendMail(mailOptions, function(error, info){
                                        if(error){
                                            console.log(error);
                                        }
                                        else{
                                            console.log('Message sent: ' + info.response);
                                        }
                                    });
                                }
                            });
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
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(5000);
httpsServer.listen(8443);