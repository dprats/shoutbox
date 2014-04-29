var User = require('../lib/user');

//displying a login form
exports.form = function(req,res){
	res.render('login', {title: 'Login'});
};

//listing 9.13
//function for handling submission of login credentials
exports.submit = function(req,res,next){
	var data =req.body.user;
	//check credentials
	User.authenticate(data.name, data.pass, function(err,user){
		if (err) return next(err);
		//if credentials are valid
		if (user) {
			req.session.uid = user.id; //store UID for authentication
			console.log('         locals.user:%s', res.locals.user);
			res.redirect('/');
		} else {
			//if credentials are not valid
			console.log("try new credentials");
			res.error('Sorry! invalid credentials');
			res.redirect('back'); //redirect to login form
		}
	});

};

//logging out of app, p.216
exports.logout = function(){
	req.session.destroy(function(err){
		if (err) throw err;
		res.redirect('/');
	});
};