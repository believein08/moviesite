var Movie=require('../app/controllers/movie');
var User=require("../app/controllers/user");
var Index=require("../app/controllers/index");

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
app.get('/admin/movie',Movie.movie);
app.get('/admin/update/:id',Movie.update);
app.post('/admin/movie/new',Movie.post);
app.get('/admin/list',Movie.list);
app.delete('/admin/list',Movie.del);

}
