//Creating a user model
var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient(); //create redis connection

//exporting the "User" function from the module
module.exports = User;


//User function accepts an object and merges this
//object's properties into its own

//new User({ name: 'Tobi'}) creates an object and sets
//the object's name property to 'Tobi'
function User(obj){
	for (var key in obj){
		this[key] = obj[key];
	}
}





//Saving a user to Redis

User.prototype.save = function(fn){
  if (this.id) {
    this.update(fn);
  } else {
    var user = this;
    db.incr('user:ids', function(err, id){
      if (err) return fn(err);
      user.id = id;
      user.hashPassword(function(err){
        if (err) return fn(err);
        user.update(fn);
      });
    });
  }
};



User.prototype.update = function(fn){
	var user = this;
	var id = user.id;
	db.set('user:id:' + user.name, id, function(err){
		if (err) return fn(err);
		//use redis hash to store data
		db.hmset('user:' + id, user, function(err){
			fn(err);
		});
	});	
};

User.prototype.hashPassword = function(fn){
	var user = this;
	//generate 12-char salt
	bcrypt.genSalt(12, function(err,salt){
		if (err) return fn(err);
		user.salt = salt; //set the salt
		bcrypt.hash(user.pass, salt, function(err, hash){
			if (err) return fn(err);
			user.pass = hash;
			fn(); 
		});
	});
}




// look up user ID by name, listing 9.7
User.getByName = function(name,fn){
	User.getId(name, function(err,id){
		if (err) return fn(err);
		//grab user with ID
		User.get(id, fn);
	});
};

//Listing 9.7
User.getId = function(name, fn){
	//we call the value of the key set on line 32
	db.get('user:id:' + name, fn);	
}
//listing 9.7
User.get = function(id, fn){
	db.hgetall('user:' + id, function(err,user){
		if (err) return fn(err);
		fn(null, new User(user)); //convert plain object to new User object
	});
}

User.authenticate = function(name, pass, fn){
	//get user by username
	User.getByName(name, function(err,user){
		if (err) return fn(err);
		if (!user.id){
			console.log("user doesnt exist");
			return fn(); 
		} //if user doesnt exist
		//hash the password passed to the function and compare it
		//to hash in the user object
		bcrypt.hash(pass, user.salt, function(err,hash){
			if (err) return fn(err);
			//if match was foun
			if (hash == user.pass) {
				console.log("user authenticated");
				return fn(null, user);
			} 
			console.log("user NOT authenticated");
			fn(); //perform fn() if hash does not match
		});
	});
};

User.prototype.toJSON = function(){
	return {
		id: this.id,
		name: this.name
	}
};

var arya = new User({
	name: 'Arya',
	pass: 'im a puppy',
	age: '3'
});

arya.save(function(err){
	if (err) throw err;
	console.log('user.id=%d saved with user.name=%s', arya.id,arya.name);
});




