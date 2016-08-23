var Movie=require('../models/movie')
var _=require('underscore')

exports.detail=function (req,res) {
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
	
};
//movie page
exports.movie=function (req,res) {
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
};

//admin update movie
exports.update=function(req,res){
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
}
//admin post movie
exports.post=function(req,res){
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
}

exports.list=function (req,res) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{

			title:'moviesite列表页',
			movies:movies 
		})
	})

	
};

//list delete movie
exports.del=function(req,res){
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
}
