var alert = require('alert-node');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var app = express();
var Type = require('type-of-is');
var MONGOOSE = require('mongoose');
var fs = require('fs');
var Schema = MONGOOSE.Schema;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(express.static('/home/ec2-user/LMS/Library'));
app.use(express.static('/home/ec2-user/LMS/node_modules'));
app.use(express.static('/home/ec2-user/LMS/Library/css'));
app.use(express.static('/home/ec2-user/LMS/Library/img'));
app.use(express.static('/home/ec2-user/LMS/Library/js'));
app.use(express.static('/home/ec2-user/LMS/Library/scss'));
app.use(express.static('/home/ec2-user/LMS/Library/vendor'));
var UserSchema = new Schema({
	'first_name': String,
	'last_name': String,
	'email': String,
	'mobile': Number,
	'signed_date': String,
	'last_logged': String,
	'password': String,
	'is_admin': Boolean,
	'my_books': Schema.Types.Mixed
});
var BooksSchema = new Schema({
	'Name': String,
	'Author': String,
	'ISBN': String,
	'Date_Published': String,
	'Quantity_Available': Number
	});

var User = MONGOOSE.model("Users", UserSchema);
var Books = MONGOOSE.model("Book", BooksSchema);
MONGOOSE.connect('mongodb://127.0.0.1:27017/library',{ useNewUrlParser: true });

app.get('/', function(req, res){
	global.loggedin = false;
	res.sendFile('/home/ec2-user/LMS/Library/index.html')
});
app.get('/goto_userhome', function(req, res){
	res.sendFile('/home/ec2-user/LMS/Library/navigators/user_home.html')
});
app.get('/goto_adminhome', function(req, res){
	res.sendFile('/home/ec2-user/LMS/Library/navigators/admin_home.html')
});
app.get('/add_new_book', function(req, res){
	res.sendFile('/home/ec2-user/LMS/Library/navigators/add_book.html')
});
app.post('/add_book', function(req, res){
	var Name = req.body.bname;
	var Author = req.body.author;
	var ISBN = req.body.isbn;
	var pub_date = req.body.d_pub;
	var quantity = req.body.qty;
	if(Name && Author && quantity){
		var book_data = {'Name': Name,'Author': Author, 'ISBN': ISBN, 'Date_Published': pub_date, 'Quantity_Available': quantity}
		global.book_data = book_data;
		console.log(book_data)
    	var entry = Books(book_data)
		entry.save()
		res.sendFile('/home/ec2-user/LMS/Library/navigators/admin_home.html')
	}
	else{
		alert('Invalid Data !')
	}
});
app.get('/manage_books', function(req, res){
	var data = Books.find({}, function(err, data_res){
		if (err) { throw err};
		var template = '<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body></nav><div class="container"><br><br><h2 class="text-center">Books</h2><br><table class="table"><thead><tr><th>Name</th><th>ISBN</th><th>Author</th><th>Date Published</th><th>Quantity Available</th></tr></thead><tbody>'
		var values = '';
		data1 = JSON.stringify(data_res)
		data = JSON.parse(data1)
		var inv_num = inv_date = order_no = customer = supply_date = '';
		data.forEach(function(element){
			inv_num = element.Name
			inv_date = element.ISBN
			order_no = element.Author
			customer = element.Date_Published
			supply_date = element.Quantity_Available
			values = values + '<tr><td>'+inv_num+'</td><td>'+inv_date+'</td><td>'+order_no+'</td><td>'+customer+'</td><td>'+supply_date+'</td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/edit_book" style="text-transform: none;line-height: 0.5;">Edit</a></td></td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/delete_book" style="text-transform: none;line-height: 0.5;">Delete</a></td></tr>'
		});	
		var footer = '<tr><td></td><td></td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_adminhome">Home</a></td><td></td><td></td></tr></tbody></table></div>'
		res.end(template+values+footer);
	});
});
app.get('/edit_book', function(req, res){
      res.end('<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body><div class="container"><br><br><h2 class="text-center">Admin can edit the book data from here.This feature is yet to be done. </h2><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_adminhome">Home</a><br></div></body>')

});
app.get('/delete_book', function(req, res){
      res.end('<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body><div class="container"><br><br><h2 class="text-center">Admin can delete the book data from here.This feature is yet to be done. </h2><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_adminhome">Home</a><br></div></body>')
});
app.get('/add_to_shelf', function(req, res){
      res.end('<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body><div class="container"><br><br><h2 class="text-center">User can add the book to shelf from here.This feature is yet to be done. </h2><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_userhome">Home</a><br></div></body>')
});
app.get('/my_books', function(req, res){
       res.end('<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body><div class="container"><br><br><h2 class="text-center">Books added to his shelf by user will be displayed here,This feature is yet to be done. </h2><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_userhome">Home</a><br></div></body>')
});
app.get('/view_books', function(req, res){
	var data = Books.find({}, function(err, data_res){
		if (err) { throw err};
		var template = '<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body></nav><div class="container"><br><br><h2 class="text-center">Books</h2><br><table class="table"><thead><tr><th>Name</th><th>ISBN</th><th>Author</th><th>Date Published</th><th>Quantity Available</th></tr></thead><tbody>'
		var values = '';
		data1 = JSON.stringify(data_res)
		data = JSON.parse(data1)
		var inv_num = inv_date = order_no = customer = supply_date = '';
		data.forEach(function(element){
			inv_num = element.Name
			inv_date = element.ISBN
			order_no = element.Author
			customer = element.Date_Published
			supply_date = element.Quantity_Available
			values = values + '<tr><td>'+inv_num+'</td><td>'+inv_date+'</td><td>'+order_no+'</td><td>'+customer+'</td><td>'+supply_date+'</td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/add_to_shelf" style="text-transform: none;line-height: 0.5;">Add</a></td></tr>'
		});	
		var footer = '<tr><td></td><td></td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_userhome">Home</a></td><td></td><td></td></tr></tbody></table></div>'
		res.end(template+values+footer);
	});
});

app.get('/manage_users', function(req, res){
	var data = User.find({}, function(err, data_res){
		if (err) { throw err};
		var template = '<head><link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"><link href="css/creative.min.css" rel="stylesheet"></head><body></nav><div class="container"><br><br><h2 class="text-center">Registered Users</h2><br><table class="table"><thead><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Mobile</th><th>Last Logged In</th><th>Date Registered</th><th>Role</th></tr></thead><tbody>'
		var values = '';
		data1 = JSON.stringify(data_res)
		data = JSON.parse(data1)
		var inv_num = inv_date = order_no = customer = supply_date = books_holding = signed_date = '';
		data.forEach(function(element){
			inv_num = element.first_name
			inv_date = element.last_name
			order_no = element.email
			customer = element.mobile
			supply_date = element.last_logged
			signed_date = element.signed_date
			if(element.is_admin){
				role = 'admin';
			}
			else{
				role = 'User';
			}

			values = values + '<tr><td>'+inv_num+'</td><td>'+inv_date+'</td><td>'+order_no+'</td><td>'+customer+'</td><td>'+supply_date+'</td><td>'+signed_date+'</td><td>'+role+'</td></tr>'
		});	
		var footer = '<tr><td></td><td></td><td><a class="btn btn-primary btn-xs" href="http://18.223.44.121:8083/goto_adminhome">Home</a></td><td></td><td></td></tr></tbody></table></div>'
		res.end(template+values+footer);
	});
});
app.get('/logout', function(req, res){
	global.loggedin = false;
	res.sendFile('/home/ec2-user/LMS/Library/index.html')
});
app.post('/user_home', function(req, res){
	var username = req.body.usr;
	var password = req.body.pwd;
	var data = User.find({'email': username}, function(err, data_res){
		if (err) { throw err};
		data1 = JSON.stringify(data_res)
		data = JSON.parse(data1)
		if(data.length == 0){
			alert('Invalid Data')
		}
		data.forEach(function(element){
				email = element.email;
				pass = element.password;
				is_admin = element.is_admin;
				var today = new Date();
				var m = today.getUTCMonth()+1;
				var s_date = today.getUTCDate()+'/'+m+'/'+today.getUTCFullYear();
				if(email == username && pass == password){
					User.updateOne({'email': username}, { $set: { last_logged: s_date }}, function(err){
						if(err)
							throw err;
						else
							console.log('Data Updated !')
					})
					if(is_admin){
						res.sendFile('/home/ec2-user/LMS/Library/navigators/admin_home.html')
					}
					else{
						res.sendFile('/home/ec2-user/LMS/Library/navigators/user_home.html')
					}
				}
				else{
					alert('Invalid Data !')
				}
				});
		});
});

app.post('/home_user', function(req, res){
	var first_name = req.body.fname;
	var last_name = req.body.lname;
	var email = req.body.mail;
	var mobile = req.body.mobile;
	var password = req.body.pwd;
	var admin = req.body.admin;
	var is_admin = false;
	if(admin == 'True'){
		is_admin = true;
	}
	var today = new Date();
	var m = today.getUTCMonth()+1;
	var s_date = today.getUTCDate()+'/'+m+'/'+today.getUTCFullYear();
	var my_books = [{'book': '', 'validity': ''}]
	if(first_name && last_name && email){
		var user_data = {'first_name': first_name,'last_name': last_name, 'email': email, 'mobile': mobile, 'password': password, 'signed_date': s_date, 'last_logged': s_date, 'is_admin': is_admin}
		global.user_data = user_data;
		console.log(user_data)
    	var entry = User(user_data)
		entry.save()
		global.loggedin = true;
		if(is_admin){
			res.sendFile('/home/ec2-user/LMS/Library/navigators/admin_home.html')
		}
		else{
			res.sendFile('/home/ec2-user/LMS/Library/navigators/user_home.html')
		}
	}
	else{
		alert('Invalid Data !')
	}
});

app.listen(8083, function() {
  console.log('Server running at http://18.223.44.121:8083/');
});
