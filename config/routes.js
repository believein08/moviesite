var Movie=require('../app/controllers/movie');
var User=require("../app/controllers/user");
var Index=require("../app/controllers/index");
var Category=require("../app/controllers/category");
console.log(Index);
module.exports=function(app){
	app.use(function(req,res,next){
	var _user=req.session.user;
	
	app.locals.user=_user;
		
	
	next();
	
})
//index
app.get('/',Index.index);

//user
app.post('/user/signup',User.signup);
app.get('/signup',User.signupshow)
app.post('/user/signin',User.signin);
app.get('/signin',User.signinshow)
app.get('/logout',User.signout);
app.get('/logout',User.signout);
app.get('/user/list',User.signinRequired,User.adminRequired,User.list);

//movie
app.get('/movie/:id',Movie.detail);
app.get('/admin/movie',User.adminRequired,Movie.movie);
app.get('/admin/movie/update/:id',User.adminRequired,Movie.update);
app.post('/admin/movie/new',User.adminRequired,Movie.post);
app.get('/admin/movie/list',User.adminRequired,Movie.list);
app.delete('/admin/movie/list',User.adminRequired,Movie.del);

//category
app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
app.post('/admin/category/save',User.signinRequired,User.adminRequired,Category.save);
app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list);

}
