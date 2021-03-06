let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let request=require('request');

let suhu = ""
let humidity = ""

server.listen(7500,()=>{
    console.log("Server is running!")
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/getData', function (req, res) {
  res.send({
    suhu:suhu,
    humidity:humidity
  })
});

app.get("/set/:suhu/:humidity",(req,res,next)=>{
  // request.get("http://hfloryiot.xyz/upload2.php?id='AAAA'&jenis=1&tgl=16&bln=9&thn=2019&jam=20&mnt=34&dtk=03&t="+String(req.params.suhu)+"&rh="+String(req.params.humidity)+"&t1=90&t2=70&t3=29.8&rh1=30&rh2=70&rh3=44.2&tes=0",function(err,res,body){
  //   console.log("Run")
  // })
  suhu=req.params.suhu
  humidity=req.params.humidity
  res.send({
    suhu:req.params.suhu,
    humidity:req.params.humidity
  })
})

io.on('connection', function (socket) {
  setInterval(function(){
    request.get('http://167.71.214.196:7500/',function(err,res,body){
    console.log(body) 
    console.log("suhu: "+suhu)
    console.log("humidity: "+humidity)
  });
    socket.emit('iot_push', { suhu: suhu, humidity: humidity});
  }, 1000);
    socket.on('iot_push', function (data) {
      console.log(data);
    });
  
});