
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

var url = 'mongodb://localhost:27017/transports';

mongoClient.connect(url, function(err, db) {
      createDocuments(db, function() {
	    db.close();
	  });
});

var createDocuments = function(db, callback) {
     var collection = db.collection("bank_details");
     collection.insert([
	{firstname : "Rams",lastname: "Posa",emailid: "rams@journaldev.com"}, 
	{firstname : "Mani",lastname: "Nulu",emailid: "mani@journaldev.com"},  
	{firstname : "Bhargs",lastname: "Nulu",emailid: "Bhargs@journaldev.com"}, 
	], function(err, result) {
	callback(result);
      });
}
