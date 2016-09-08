var Movie=require('../models/movie');
var Category=require('../models/category')

exports.index=function (req,res) {
	Category.find({})
	.populate({path:'movies',options:{limit:5}}).exec(function(err,catetories){
		if(err){
			console.log(err)
		}
		res.render('index.jade',{
			title:'sharksLove电影网',
			catetories: catetories			
		});
	})
	// var _user=req.session.user;
	// // app.locals.user=_user;
	// Movie.fetch(function(err,movies){

	// });	
}

