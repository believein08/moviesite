var Category=require('../models/category')
exports.new=function(req,res){
	res.render('category_admin',{
		title: '添加分类页',
		category:{}
	})
}
exports.save=function(req,res){
	var _category=req.body.category;
	console.log(_category);
	var category=new Category(_category);
	category.save(function(err,category){
		if(err){
			console.log(err);
		}
		res.redirect('/admin/category/list');
	})
}
exports.list=function (req,res) {
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		
		res.render('categorylist',{

			title:'分类列表页',
			categories:categories 
		})
	})	
}
exports.del=function(req,res){
	var id=req.query.id;
	console.log(id);
	if(id){
		Category.remove({_id: id},function(err,movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success: 1})
			}
		})
	}
}