var nodemailer = require('nodemailer');
var cyberTransport = nodemailer.createTransport({
    host: "smtpout.asia.secureserver.net",
    secureConnection: false,
    port: 3535,
    auth: {
        user: 'info@cybersrishti.com',
        pass: 'Cyber@21'
    }
});
const db = require('./db.js');
db.query('Select participants, formid from part', function(error, results){
	var participants = results;
	if(error) throw error;
	else{
		var i = 0;
		for(var i in participants){
			var t = (participants[i].participants).split('\+');
			var enrollId = parseInt(t[0], 10);
			var teamId  = '';
			var formName='';
			db.query('Select teamid from part where participants = ? and formid = ?', [participants[i].participants, participants[i].formid], function(error, results){
				if(error) throw error;
				else{
					teamId = results[0].teamid;
				}
			});
			db.query('Select name from formid where id = ?', [participants[i].formid], function(error, results){
				if(error) throw error;
				else{
					formName = results[0].name
				}
			});
			db.query('Select email, name from stud where enroll = ?', [enrollId], function(error, results){
				if(error) throw error;
				else{
					if(results.length){
						console.log(results[0].email);
						console.log(results[0].name);
						console.log(formName);
						console.log(teamId);
						var mailOptions = {
                            from: 'info@cybersrishti.com',
                            to: results[0].email,
                            subject: 'Registration @ Cyber-Srishti',
                            html: '<b>Welcome to Cyber-Srishti.</b><br><br> We are sorry for the unexpected error occurred in the website due to which we had to generate new TeamID for each and every team. Therefore, We are now sending the new Team IDs along with the corresponding events. <br><br><b>Your team ID for the event  '+formName+'  is' + teamId + '</b>.<br><br> Please keep it with you at the event. If you see that you have recieved the mail in error, please contact us. Also, please don\'t reply to the above email address. Thank You'
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
				}
			});
		}
	}
});