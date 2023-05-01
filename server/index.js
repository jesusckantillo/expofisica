const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);



const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
app.get('/',(req,res,next)=>{
    res.sendFile(__dirname +'/index.html')
})


const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 9600
    }
)

const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }))

//Parser listener funcs
parser.on('open',function(){
    console.log("Conexion abierta")
});

parser.on('data',function(data){
    var enc = new TextDecoder();
    var arr = new Uint8Array(data);
    ready = enc.decode(arr)
    console.log(ready)
    io.emit('arduino.data',{
        value: ready.toString()
    })
});

port.on('error',function(err){
    console.log(err)
})


io.on("connection", function (socket) {
    console.log("Un cliente se ha conectado");
  });


server.listen(3000, ()=>{
    console.log('server on port 3000')
})