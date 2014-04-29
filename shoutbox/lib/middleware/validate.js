//parse entry[name] notation
function parseField(field){
	return field
					.split(/\[|\]/)
					.filter(function(s){ return s});
};

//look up property based on parseField results

function getField(req,field){
	var val = req.body;
	field.forEach(function(prop){
		val = val[prop];
	});
	return val;
}

exports.required = function(field){
	field = parseField(field); //parse field once
	return function(req,res, next){
		//on each request, check if field has a value
		if (getField(req,field)){
			next(); //if it does, move on to next middleware component
		} else { //if no field, display an error
			res.error(field.join(' ') + 'is required');
			res.redirect('back');
		}
	}
};

exports.lengthAbove = function(field, len){
	field = parseField(field);
	return function(req,res,next){
		if (getField(req, field).length > len){
			next();
		} else {
			res.error(field.join(' ') + ' must have more than ' + len + ' characters');
			res.redirect('back');
		}
	}
};