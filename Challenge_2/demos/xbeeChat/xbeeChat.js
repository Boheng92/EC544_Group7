var SerialPort = require("serialport");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var portName = process.argv[2],
portConfig = {
	baudRate: 9600,
	parser: SerialPort.parsers.readline("\n")
};


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


var sp;

var MongoClient;

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

// Coordinates
var X = [5, 5, -5, -5];
var Y = [5, -5, 5, -5];

//var doc;

MongoClient = require('mongodb').MongoClient
				, assert = require('assert');

url = 'mongodb://localhost:27017/dbTest';				
				
sp = new SerialPort.SerialPort(portName, portConfig);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    sp.write(msg + "\n");
  });
  
 //For transmission test 9/29/2015
 socket.on('chat message', function(msg)
 {
	// TODO: 调用query， msg形式为ID加一个时间段，形如“[ID][时:分:秒]” query返回10个该ID的，形式为[time][Temperature]
	var temp_ID;
	var temp_time;
	console.log("checkmsg",msg);
	temp_ID = msg.substring(1, 2);
	temp_ID = parseInt(temp_ID);
	temp_ms = parseInt(msg.substring(4, (msg.length - 1)));
	//var timeTest = 1443308360000; //default setting, only for developing!
	
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
	
		console.log(" io.on Connected correctly to server");
		var collection = db.collection('test');
	
		var cursor =collection.find( {"Device_ID": temp_ID, "Time_ms" : { $lt: temp_ms }});
				
				cursor.sort({Time_ms: -1});				
				cursor.limit(10);
				
				//var msgTest = '';
																			
				cursor.each(function(err, doc) 
				{					
				    if (err) 
					{
						console.log(err);
					} 
					if (doc != null) 
					{
						var temp = doc.Temperature;
						var judge = doc.Time_ms;
						var time = doc.Time;
						var msgTest = '[' + time + ']' + '[' + temp + ']';
						console.log("checkmsg" + msgTest);
						
						io.emit("history", msgTest);
						//msgTest = msgTest + '[' + time + ']' + '[' + temp + ']';						
				    }
					else
					{
						io.emit("end of history", 'end');
					}
				
				});
	
	
	
	
	console.log("Horray~ " + temp_ID + temp_time);
	});
 });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
	console.log('open');
	
	sp.on('data', function(data) {
	
		var msg0 = '';
		var msg1 = '';
		var msg2 = '';
		var msg3 = '';
		var msgA = '';
		
		// Handle received Data
		console.log('data received: ' + data);
	
		// Parse data
		deviceID = parseInt(data.substring(1, 2));
		
		var temp_temperature = parseFloat(data.substring(4, (data.length - 1)));
		// Ignore the invalid ones
		if( (temp_temperature > (-100.00)) && (temp_temperature < 100.00))
		{
			temperature[deviceID] = temp_temperature;
	
			update[deviceID] = 1;
		}
	
		if( ( update[0] == 1 ) && ( update[1] == 1) && ( update[2] == 1) && ( update[3] == 1) )
		{
			current = new Date();
			time = current.toLocaleTimeString();
			newTime = current.toString();
			time_ms = Date.parse(newTime);
			
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
				var message_0 = {Device_ID: 0, Temperature: temperature[0], Time: time, Time_ms: time_ms, X : X[0], Y : Y[0]};
				var message_1 = {Device_ID: 1, Temperature: temperature[1], Time: time, Time_ms: time_ms, X : X[1], Y : Y[1]};
				var message_2 = {Device_ID: 2, Temperature: temperature[2], Time: time, Time_ms: time_ms, X : X[2], Y : Y[2]};
				var message_3 = {Device_ID: 3, Temperature: temperature[3], Time: time, Time_ms: time_ms, X : X[3], Y : Y[3]};
				// Average
				var message_A = {Device_ID: 9, Temperature: average, Time: time, Time_ms: time_ms};
				
				var emitMsg0 = '[0]' + '[' + temperature[0] + ']';
				var emitMsg1 = '[1]' + '[' + temperature[1] + ']';
				var emitMsg2 = '[2]' + '[' + temperature[2] + ']';
				var emitMsg3 = '[3]' + '[' + temperature[3] + ']';
				
				var emitMsgA = '[9]' + '[' + average + ']';
				
				
				io.emit("temp message", emitMsg0);
				io.emit("temp message", emitMsg1);
				io.emit("temp message", emitMsg2);
				io.emit("temp message", emitMsg3);
				
				//io.emit("chat message", emitMsgA);
				
			
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
					
					//db.close();
				});
			});
		}
	});
});


