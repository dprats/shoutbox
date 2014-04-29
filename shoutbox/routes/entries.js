var Entry = require('../lib/entry'); //call model


exports.list = function(req,res,next){
	//retrieve entries
	Entry.getRange(0,-1,function(err,entries){
		if (err) return next(err);

		res.render('entries', { //render HTTP response
			title: 'Entries',
			entries: entries,
		});
	});
};


//form for posting an entry
exports.form = function(req,res){
	res.render('post', {title: 'Post'});
}

//logic for submitting entries, listing 9.23
exports.submit = function(req,res,next){
	console.log("Submit=%s", req.body);
	var data = req.body.entry;
	var entry = new Entry({
		"username": res.locals.user.name,
		"title": data.title,
		"body": data.body
	});

	entry.save(function(err){
		if (err) return next(err);
		if (req.remoteUser) {
			console.log('entry added for remote user');
			res.json({message: 'Entry Added.'});
		}
		console.log("             entry saved");
		res.redirect('/');
	});
};


