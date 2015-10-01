///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

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
	
	//For transmission test 9/29/2015
	socket.on('chat message', function(msg)
	{
		// TODO: 调用query， msg形式为ID加一个时间段，形如“[ID][时:分:秒]” query返回10个该ID的，时间之前的数据结果存入文件“jinke.la”，形式为[time][Temperature]
		console.log("Horray~ " + msg);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + data);
    io.emit("chat message", "An XBee says: " + data);
  });
});
