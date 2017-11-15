var async = require('async');

var express=require('express'),
	mysql=require('mysql'),
	credentials=require('./credentials.json'),
	app = express(),
	port = process.env.PORT || 1337;

credentials.host='ids.morris.umn.edu'; //setup database credentials

var buttons;
var current_transactions;
var connection = mysql.createConnection(credentials); // setup the connection
sql = "select * from institutional_casey.till_buttons;"


connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname + '/public'));
app.get("/buttons",function(req,res){
	var sql = 'SELECT * FROM institutional_casey.till_buttons';
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);}
		buttons=rows;
		res.send(rows);
	}})(res));
});

app.get("/click",function(req,res){
	var id = req.param('id');
	fixed_index_id = id-1;
	var label = buttons[fixed_index_id].label;
	var item_price = prices[fixed_index_id].price;
	var sql = 'insert into institutional_casey.current_transaction (label,price,Amount,buttonID) values ("' + label +'",' + item_price +  ',1,' + id +') on duplicate key update Amount = Amount+1;';

	console.log("Attempting sql ->"+sql+"<-");

	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);
		}
		server_response=	res.send(rows);
	}})(res));
});
app.get("/prices",function(req,res){
	var sql = "select * from institutional_casey.prices";	
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error");
			console.log(err);}
		prices = rows;
		res.send(rows);
	}})(res));
});


app.get("/trans",function(req,res){
	var sql = 'SELECT * FROM institutional_casey.current_transaction;';
	connection.query(sql,(function(res){return function(err,rows,fields){
		if(err){console.log("We have an error:");
			console.log(err);}
		current_transactions = rows;
		res.send(rows);
	}})(res));

});


app.get("/removeItem", function(req,res){
	var id = req.param('id');
	if(current_transactions[id-1].Amount == 1){
		var sql = 'DELETE FROM institutional_casey.current_transaction where buttonID = ' + id;
		console.log("Attempting sql ->" + sql + "<-");
	} 
	else{
		var sql = 'update institutional_casey.current_transaction set Amount = Amount-1 where buttonID ='+ id+ ';'
	}
	console.log("Attempting sql ->" + sql + "<-");

	connection.query(sql,(function(res){
		return function(err,rows,fields){
			if(err){
				console.log("We have a problem");
				console.log(err);
			}
			res.send(rows);
		}})(res));
});

app.listen(port);
