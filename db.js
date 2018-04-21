var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'ec2-13-127-154-121.ap-south-1.compute.amazonaws.com',
  user: 'root',
  password: 'ngudbhavcorp',
  database : 'cyber'
});

connection.connect();
module.exports = connection;