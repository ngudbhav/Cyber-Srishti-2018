var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'host',
  user: 'host',
  password: 'host',
  database : 'host'
});

connection.connect();
module.exports = connection;
