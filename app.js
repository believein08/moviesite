var express=require('express');
var mongoose=require('mongoose')
var port =process.env.PORT || 3000
var path=require('path')
var app=express();
var serveStatic=require('serve-static')
var bodyParser=require('body-parser')
var Movie=require('./models/movie')
var _=require('underscore')
var User=require("./models/user");
var session = require('express-session');
var MongoStore=require('connect-mongo')(session);
var dburl='mongodb://localhost/moviesite';
mongoose.connect(dburl);
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(serveStatic('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.listen(port)
app.locals.moment=require('moment')//存疑，这句话用来干什么？
app.use(session({
	secret:'sharkslove',
	store:new MongoStore({
		url:dburl,
		collection:'sessions'

	})
}))
console.log("moviesite started on port" + port);

//index page
app.get('/',function (req,res) {
	console.log(req.session.user);
	var _user=req.session.user;
	app.locals.user=_user;
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index.jade',{
			title:'moviesite首页',
			movies: movies			
		})
	})	
});

//signup
app.post('/user/signup',function(req,res){
	var _user=req.body.user;
	
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			 res.redirect('/');
		}else{
			var user=new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/user/list');
			})
		}
	});
	
})
//signin
app.post('/user/signin',function(req,res){
	var _user=req.body.user;
	var name=_user.name;
	var password=_user.password;
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err)
				console.log(err);
			if(isMatch){
				req.session.user=user;
				res.redirect('/')
			}else{
				console.log('Password is not right');
			}
		})
	})
})
//signout
app.get('/logout',function(req,res){
	delete req.session.user;
	delete app.locals.user;
	res.redirect("/");
})
//list page
app.get('/user/list',function (req,res) {
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		console.log("users="+users);
		res.render('userList',{

			title:'moviesite列表页',
			users:users 
		})
	})	
});

//detail page
app.get('/movie/:id',function (req,res) {
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		console.log(movie)
		if(err){
			console.log(err)
		}
		res.render('detail',{
			title:'sharkslove',
			movie:movie 
		})
	});
	
});
//movie page
app.get('/admin/movie',function (req,res) {
	res.render('admin',{
		title:'moviesite后台录入页',
		movie: {
		      doctor: '',
		      country: '',
		      title: '',
		      year: '',
		      poster: '',
		      language: '',
		      flash: '',
		      summary: ''
		}
	})
});

//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id =req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			res.render('admin',{
				title:"后台更新页",
				movie:movie
			})
		})
	}
})
//admin post movie
app.post('/admin/movie/new',function(req,res){
	console.log(res.body)
	var id=req.body.movie._id
	var movieObj=req.body.movie
	var _movie
	if(id!=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			console.log(1)
			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			doctor: movieObj.doctor,
			country: movieObj.conntry,
			title: movieObj.title,
			year: movieObj.year,
			language: movieObj.language,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash: movieObj.flash,

		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			console.log(movie._id)
			res.redirect('/movie/'+movie._id)
		})
	}
})
//list page
app.get('/admin/list',function (req,res) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{

			title:'moviesite列表页',
			movies:movies 
		})
	})

	
});

//list delete movie
app.delete('/admin/list',function(req,res){
	var id=req.query.id;
	console.log(id);
	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success: 1})
			}
		})
	}
})

