//creating the entry model
//entries are how we post to the shoutbox app


var redis = require('redis');
var db = redis.createClient();

module.exports = Entry; // export Entry function from the module

function Entry(obj){
	for (var key in obj){
		this[key] = obj[key]; //merge values
	}
}

Entry.prototype.save = function(fn){
	//convert saved entry data to JSON string
	var entryJSON = JSON.stringify(this);

	//save JSON string to Redis list
	db.lpush(
		'entries',
		entryJSON,
		function(err){
			if (err) return fn(err);
			fn();
		}
	);
};

//function allows us to retrueve the entries
Entry.getRange = function(from, to, fn){
	db.lrange('entries', from, to, function(err, items){
		if (err) return fn(err);
		var entries = [];
		items.forEach(function(item){
			entries.push(JSON.parse(item));
		});
		fn(null, entries);
	});
}

Entry.count = function(fn){
  db.llen('entries', fn);
};