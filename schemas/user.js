var mongoose= require('mongoose')
var bcrypt= require('bcryptjs')
var SALT_WORD_FACTOR=10;
var UserSchema=new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	password:{
		unique:true,
		type:String
	},
	meta:{
		createAT:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

UserSchema.pre('save',function(next){
	var user=this;
	if(this.isNew){
		this.meta.creatAT=this.meta.updateAt=Date.now()

	}else{
		this.meta.updateAt=Date.now();
	}
	bcrypt.genSalt(SALT_WORD_FACTOR,function(err,salt){
		if(err) 
			return next(err);
		bcrypt.hash(user.password+"",salt,function(err,hash){
			user.password=hash;
			next();
		})
	})
	

})
UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){
				return cb(err);
			}
			cb(null,isMatch);

		})
	}
}
UserSchema.statics={
	fetch:function(cb ){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}
module.exports=UserSchema




