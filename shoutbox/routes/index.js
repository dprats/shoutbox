
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

//404 page if resource not found, listing 9.32
exports.notfound = function(req,res){
	res.status(404).format({
		html: function(){
			res.render('404');
		},
		json: function(){
			res.send({message: 'Resource not found'});
		},
		xml: function(){
			res.write('<error>\n');
			res.write(' <message>Resource not found</message>\n');
			res.end('</error>');
		},
		text: function(){
			res.send('Resource not found');
		}
	});
};

//error-handling middleware must have exactly 4 parameters
exports.error = function(err, req,res, next){
	//log error to stdrr stream
	console.error(err.stack);
	var msg;

	switch(err.type){
		case 'database':
			msg ='Server unavailable';
			res.statusCode = 503;
			break;
		default:
			msg = 'Internal Server Error',
			res.statusCode = 500;
	}
	res.format({
		html: function(){
			res.render('5xx', {msg: msg, status: res.statusCode });
		},
		json: function(){
			res.send({error: msg});
		},
		text: function(){
			res.send(msg + '\n');
		}
	});

};