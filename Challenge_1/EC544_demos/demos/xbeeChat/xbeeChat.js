var SerialPort = require("serialport");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var portName = process.argv[2],
portConfig = {
	baudRate: 9600,
	parser: SerialPort.parsers.readline("\n")
};

var sp;

var MongoClient 

// Connection URL
var url;

var deviceID = 9;

var current;
		
var time = '99:99:99';

var time_ms = 999999999; 

var average = -999.99;

var temperature = new Array([4]);

// Update Status of Temperatures 
// 0: Pending 1: Updated
var update = [0, 0, 0, 0];
  
// Temperatures
var temperature = new Array([4]);

MongoClient = require('mongodb').MongoClient
				, assert = require('assert');

url = 'mongodb://localhost:27017/dbTest';				
				
sp = new SerialPort.SerialPort(portName, portConfig);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    sp.write(msg + "\n");
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
	console.log('open');
  
	sp.on('data', function(data) {
	
		// Handle received Data
		console.log('data received: ' + data);
	
		// Parse data
		deviceID = parseInt(data.substring(1, 2));
		
		temperature[deviceID] = parseFloat(data.substring(4, (data.length - 1)));
	
		update[deviceID] = 1;
	
		if( ( update[0] == 1 ) && ( update[1] == 1) && ( update[2] == 1) && ( update[3] == 1) )
		{
			current = new Date();
			time = current.toString();
			time_ms = Date.parse(time);
			
			average = (temperature[0] + temperature[1] + temperature[2] + temperature[3]) / 4;
			average = parseFloat(average.toFixed(2));
		
			update[0] = 0;
			update[1] = 0;
			update[2] = 0;
			update[3] = 0;
		
			// DB operations
			// Use connect method to connect to the Server
			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
			
				console.log("Connected correctly to server");	
			
				// Get the documents collection
				var collection = db.collection('test');

				// Create tables
				var message_0 = {Device_ID: 0, Temperature: temperature[0], Time: time, Time_ms: time_ms};
				var message_1 = {Device_ID: 1, Temperature: temperature[1], Time: time, Time_ms: time_ms};
				var message_2 = {Device_ID: 2, Temperature: temperature[2], Time: time, Time_ms: time_ms};
				var message_3 = {Device_ID: 3, Temperature: temperature[3], Time: time, Time_ms: time_ms};
				// Average
				var message_A = {Device_ID: 9, Temperature: average, Time: time, Time_ms: time_ms};
			
				collection.insert([message_0, message_1, message_2, message_3, message_A], function (err, result) 
				{
					if (err) 
					{
						console.log(err);
					} 
					else 
					{
						console.log('Inserted %d documents into the "test" collection. The documents inserted with "_id" are:', result.length, result);
					}
			
					db.close();
				});
			});
			
			// Transmit the parsed data to the html
			io.emit("chat message", '(' + temperature[0] + ')' + '(' + temperature[1] + ')' + '(' + temperature[2] + ')' + '(' + temperature[3] + ')' + '[' + average + ']' + '{' + time + '}');
		}
	});
});


