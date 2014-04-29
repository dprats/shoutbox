var User = require('../user');

//middleware function is exported and then it checks
//the session for the user ID. when the ID is present,
//a user is authenticated, so its safe to fetch the
//user data from redis

module.exports = function(req,res,next){
	var uid = req.session.uid; //get logged-in user ID from session
	if (!uid) return next(); //if user is not logged in
	User.get(uid, function(err,user){ //get logged-in user's data from redis
		if (err) return next(err);
		req.user = res.locals.user = user; //expose our data to response object
		next();
	});
};