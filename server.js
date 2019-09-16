let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let request=require('request');

let suhu = ""
let humidity = ""

server.listen(6500,()=>{
    console.log("Server is running!")
});
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get("/set/:suhu/:humidity",(req,res)=>{
     request.get("hfloryiot.xyz/upload2.php?id='AAAA'&jenis=1&tgl=16&bln=9&thn=2019&jam=20&mnt=34&dtk=03&t="+req.params.suhu+"&rh="+req.params.humidity+"&t1="+req.params.suhu+"&t2="+req.params.humidity+"&t3=29.8&rh1=30&rh2=70&rh3=44.2&tes=0")
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
  setInterval(function(){
    request.get('http://hfloryiot.xyz/sensor2.php?id=AAAA&jenis=1',function(err,res,body){
    console.log(body.split("|"))
    suhu = body.split("|")[8]
    humidity = body.split("|")[9]
    console.log("suhu: "+suhu)
    console.log("humidity: "+humidity)
  });
    socket.emit('iot_push', { suhu: suhu, humidity: humidity});
  }, 2000);
  socket.on('iot_push', function (data) {
    console.log(data);
  });
  
});