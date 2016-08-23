var express=require('express');
var mongoose=require('mongoose')
var port =process.env.PORT || 3000
var path=require('path')
var app=express();
var serveStatic=require('serve-static')
var bodyParser=require('body-parser')
var session = require('express-session');
var MongoStore=require('connect-mongo')(session);
var dburl='mongodb://localhost/moviesite';
var morgan=require('morgan');
mongoose.connect(dburl);
app.set('views','./app/views/pages')
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

if('development'===app.get('env')){
	app.use(morgan(':method :url :response-time'));
	app.set('showStackError',true);
	app.locals.pretty =true;
	mongoose.set('debug', true);
	console.log("开发环境");

}
require('./config/routes')(app);
console.log("moviesite started on port:" + port);


