//requires both express and user model

var express = require('express');
var User = require('../lib/user');

exports.auth = express.basicAuth(User.authenticate);
//section 9.33
exports.user = function(req,res,next){
	User.get(req.params.id, function(err, user){
		if (err) return next(err);
		if (!user.id) return res.send(404);
		res.json(user);
	});
};

