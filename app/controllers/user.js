var User=require("../models/user");
//signup
exports.signup=function(req,res){
	var _user=req.body.user;
	
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			 res.redirect('/signin');
		}else{
			var user=new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/');
			})
		}
	});
	
}
//signin
exports.signin=function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err)
				console.log(err);
			if(isMatch){
				req.session.user=user;
				res.redirect('/')
			}else{
				return res.redirect('/signin')
				console.log('Password is not right');
			}
		})
	})
}
exports.signupshow=function(req,res){
	res.render('signup',{
		title:"用户注册"
	});
}
exports.signinshow=function(req,res){
		res.render('signin',{
		title:"用户登录"
	});
}

//signout
exports.signout=function(req,res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect("/");
}
//list page
exports.list=function (req,res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		
		res.render('userList',{

			title:'moviesite列表页',
			users:users 
		})
	})	
}
exports.signinRequired=function(req,res,next){
	var user=req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next();
}
exports.adminRequired=function(req,res,next){
	var user=req.session.user;
	if(user.role<=10){
		return res.redirect('/signin');
	}
	next();
}
