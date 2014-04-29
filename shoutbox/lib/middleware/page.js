
//listing 9.26
module.exports = function(fn, perpage){

	perpage = perpage || 10;
	return function(req, res, next){ //return a middleware function
		
		var page = Math.max(
			parseInt(req.param('page') || '1', 10),
			1
		) - 1;

		//invoke function passed
		fn(function(err, total){
			if (err) return next(err); //delegate errors

			//storing pape properties for future reference
			req.page = res.locals.page = {
				number: page,
				perpage: perpage,
				from: page * perpage,
				to: page*perpage + perpage -1,
				total: total,
				count: Math.ceil(total / perpage)
			};
			next();
		});
	}
};