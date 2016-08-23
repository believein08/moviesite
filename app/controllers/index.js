var Movie=require('../models/movie');
var _=require('underscore');
var User=require("../models/user");

exports.index=function (req,res) {
	
	var _user=req.session.user;
	// app.locals.user=_user;
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index.jade',{
			title:'moviesite首页',
			movies: movies			
		});
	});	
}