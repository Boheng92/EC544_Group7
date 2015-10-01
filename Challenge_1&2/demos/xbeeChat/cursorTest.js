var MongoClient 
// Connection URL
var url;

//Define the StringBuilder function
function StringBuilder(){
	this._stringArray = new Array();
}

StringBuilder.prototype.append = function(str){
	this._stringArray.push(str);
}

StringBuilder.prototype.toString = function(joinGap){
	return this._stringArray.join(joinGap);
}

// DB operations
MongoClient = require('mongodb').MongoClient
				, assert = require('assert');
url = 'mongodb://localhost:27017/dbTest';								
console.log('test begin');
	

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
			
console.log("Connected correctly to server");	
			
// Get the documents collection
var collection = db.collection('test');

var cursor =collection.find( );
				
cursor.sort({Time_ms: -1});
				
cursor.limit(3);

//fileSystem Operation
var fs = require('fs');
var file = "c:\\test\\a.txt";
//var finalOutput = '[' + change + ']';
var sb = new StringBuilder();
	
var myFunc = function(msg)
{
	console.log("Horray~ " + msg);
}
	/*
socket.on('message', function(msg){
	console.log("Horray~ " + msg);
}	*/
				
cursor.each(function(err, doc) 
{
	console.log("foreach run");
	if (err) 
	{
		console.log(err);
	} 
	if (doc != null) 
	{
		var temp = doc.Temperature;
		var t = doc.Time;
		var each = {
			"Temperature" : temp,
			"Time" : t
		};
		var str_each = JSON.stringify(each);
		//var sb2 = new StringBuilder();
		sb.append(str_each);
		//sb2.append(" ,");		
		//var a = JSON.stringify(doc);
	}
});

console.log("haha run");
var result = sb.toString(", ");
console.log("result" + result);

fs.appendFile(file,result,function(err){
	if(err)
		console.log("fail" + err);
	else
		console.log("OK");
});
				
//db.close();
			
});



