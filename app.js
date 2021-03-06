 //Specify the Port to listen on
 const port = process.env.PORT || 8080;

var express = require('express');
var path = require('path');

var createError = require('http-errors');

var session = require('express-session');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var expressLayouts = require('express-ejs-layouts');

var mysql = require('mysql');

//Setup External Files
var connection  = require('./lib/db');

var homeRouter = require('./routes/index');


var app = express();
app.use(expressLayouts);


 
// Setup the Views Templating Engine
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(path.join(__dirname, 'public')));

// Includes the css files
 app.use(express.static('public'));
 app.use('/css', express.static(__dirname + 'public/css'))

 
 
 //Session Settings
 app.use(cookieParser());
 app.use(session({ 
     cookie: { maxAge: 86400000 },
     secret: 'secret code 3245',
     resave: false,
     saveUninitialized: true
 }))
 
 app.use(flash());

 
 
 app.use('/',homeRouter);
 app.listen(port, () => console.log(`Listening on port ${port}..`));

 module.exports = app;