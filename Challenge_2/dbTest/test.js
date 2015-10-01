var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/dbTest';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");	
  
  var collection = db.collection('test');
  
  var doc1 = {id: '0', temperature: 10.01};
  var doc2 = {id: '1', temperature: 20.02};
  
  collection.insert([doc1, doc2], function(err,result){
	  if (err){
		  console.log(err);
	  } else {
		  console.log('haha');
	  }
  });
  db.close();
});
