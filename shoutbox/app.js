
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
var api = require('./routes/api');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser()); //added bodyParser so POST request via API works
app.use(express.json());			
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
//api middleware should be before user-loading middleware
app.use('/api', api.auth);
app.use(user);
app.use(messages);
app.use(app.router);
app.use(routes.notfound);
app.use(routes.error); //enabli

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
//routes for api
//placing at end so it does not override other routes like /upload
app.get('/:page?', page(Entry.count,5), entries.list); 
app.get('/api/user/:id', api.user);
//activate entry-adding API in my application
app.post('/api/entry', entries.submit); 
app.get('/api/entries/:page?', page(Entry.count), api.entries);

//Used to test errors-handling by creating faux errors
if (process.env.ERROR_ROUTE){
	app.get('/dev/error', function(req,res, next){
		var err = new Error('database connection failed');
		err.type = 'database';
		next(err);
	});
}	



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
