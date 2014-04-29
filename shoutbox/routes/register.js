var User = require('../lib/user');

exports.form = function(req,res){
	res.render('register', {title: 'Register Form'} );
};
//listing 9.11
exports.submit = function(req,res,next){
	var data = req.body.user;
	//checking if user name is unique
	User.getByName(data.name, function(err,user){
		if (err) return next(err); //handling DB connection and other errors

		//redis will default it

		//if username is taken
		if (user.id){
			console.log('        USER NAME ALREADY TAKEN');
			res.error("Username is already taken.");
			res.redirect('back');
		} else{
			//if username is NOT taken

			//set it to a new user object
			user = new User({
				name: data.name,
				pass: data.pass
			});

			//save the new user to the db
			user.save(function(err){
				if (err) return next(err);
				console.log('......user.save called');
				req.session.uid = user.id; //store uid for authentication
				res.redirect('/'); //redirect us to entry listing page
			});
			console.log('        CREATED NEW USER');
		} 
	});
};
