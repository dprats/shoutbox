
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var register = require('./routes/register');
var messages = require('./lib/messages'); //p.212
var login = require('./routes/login');
var user = require('./lib/middleware/user'); //p.218
var entries = require('./routes/entries');
var validate = require('./lib/middleware/validate'); //p225
var page = require('./lib/middleware/page'); 
var Entry = require('./lib/entry');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(messages);
app.use(express.static(path.join(__dirname, 'public')));
app.use(user);
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', page(Entry.count), entries.list); //p. 220 and 225
// app.get('/users', user.list);
//routes for registering a new user
app.get('/register', register.form);
app.post('/register', register.submit);
//routes for logging in
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
//creating an entry
app.get('/post', entries.form);
app.post('/post',
				validate.required('entry[title]'), //validating middleware, 9.24
				validate.lengthAbove('entry[title]',4),
				entries.submit);
////placing at end so it does not override other routes like /upload
app.get('/:page?', page(Entry.count,5), entries.list); 


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
