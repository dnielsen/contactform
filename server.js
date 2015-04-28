var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var util = require('util');


//MySql configuration goes here.
var connection = mysql.createConnection({
  host: 'us-cdbr-iron-east-02.cleardb.net',
  user: 'b9ba7e943b55d3',
  password: 'ae115ea5',
  database: 'ad_9dd39facc04c387'
});

var cfenv = require("cfenv")

var appEnv = cfenv.getAppEnv();
app.use(bodyParser.urlencoded({ extended: true }));

//This is the route for home page
app.get('/', function(req, res){
	res.render('index.html')
});

//Route for form submit. when the form is submitted it will go to this page.
app.post('/contact', function(req, res){
  
  var details = {
    'name' : req.body.name,
    'email' : req.body.email,
    'message' : req.body.message
  }

  // Form Data will be inserted into the mysql database.
  connection.query('INSERT INTO `contact` SET ?', details, function (err, result) {
      if(err){
      console.log(err)
    res.render('error.html')

      }else{
      console.log(result)
    res.render('success.html')

      }
  });
});

//This is the display page for form details.

app.get('/data', function(req, res){
	connection.query( 'SELECT name,email,message FROM `contact', function(err, rows) {
    console.log(rows)
	res.render('data.ejs', { contact:rows })

  	});
});


//server listen
app.listen(appEnv.port, appEnv.bind,function() {
    console.log('Server is running'+ appEnv.url);
});

//View folder configuration.
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
