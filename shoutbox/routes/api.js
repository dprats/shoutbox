//requires both express and user model

var express = require('express');
var User = require('../lib/user');
var Entry = require('../lib/entry');

exports.auth = express.basicAuth(User.authenticate);
//section 9.33
exports.user = function(req,res,next){
	User.get(req.params.id, function(err, user){
		if (err) return next(err);
		if (!user.id) return res.send(404);
		res.json(user);
	});
};

exports.entries = function(req,res,next){
	var page = req.page;
	//fetch entry data
	Entry.getRange(page.from, page.to, function(err, entries){
		if (err) return next(err);

		//content negotiation from 9.30
		//respond differently based on Accept header value
		res.format({
			'application/json': function(){
				res.send(entries); //JSON response
			},
			'application/xml': function(){
				res.render('entries/xml', {entries: entries});
			}
		});
	});
};
