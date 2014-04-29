//this file is created so app can queue messages to the user
//in a session variable

var express = require('express');
var res = express.response; //adding properties to this object
														//means they will be available to all 
														//middleware and routes


//provides a way to add messages to a session variable
//from any express Request
res.message = function(msg, type){
	type = type || 'info';
	var sess = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push({type: type, string: msg});
}

res.error = function(msg){
	return this.message(msg, 'error');
}

//exporting the middleware I need to expose these messages
//to the templates for output (p.212)

module.exports = function(req,res,next){
	res.locals.messages = req.session.messages || [];
	res.locals.removeMessages = function(){
		req.session.messages = [];
	}
	next();
}