var MongoClient 

// Connection URL
var url;

//var doc;

MongoClient = require('mongodb').MongoClient
				, assert = require('assert');

url = 'mongodb://localhost:27017/dbTest';				
				
	

console.log('test begin');
	

// DB operations
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
			
console.log("Connected correctly to server");	
			
// Get the documents collection
var collection = db.collection('test');

var cursor =collection.find( );
				
//cursor.sort({Time_ms: -1});
				
cursor.limit(1);
				
				
cursor.each(function(err, doc) 
{
	if (err) 
	{
		console.log(err);
	} 
	if (doc != null) 
	{
		var i = doc.Time;
		var e = doc.Device_ID;
		var f = e + 1;
		var current =  new Date();
		var a = current.toLocaleDateString();
		var b = current.toLocaleString();
		var c = current.toLocaleTimeString();
		//var d = parseInt(c);
		console.log('Fetched:', b, '/', a, '/', c, '/', f);
		db.close();
	}
});
				
//db.close();
			
});



