// SERVER INITIALIZATION
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

// STATIC ROOTS
const STATIC_ROOT = '../client/template';
const INDEX_ROOT = STATIC_ROOT + '/index.html';
const FIELD_VS_DISTANCE_ROOT = STATIC_ROOT + '/field-vs-distance.html';
const MAGNETIC_FLUX_ROOT = STATIC_ROOT + '/magnetic-flux.html';

var serialConnected = true;
const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')

//SOCKET INITIALIZATION
const server = require('http').createServer(app);
const io = require('socket.io')(server)




io.on('connection',function(socket){
  console.log("A new socket connected");
});


//SETTINGS
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, STATIC_ROOT)));

// SERVER ROOTS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, INDEX_ROOT));
  });

app.get('/field-vs-distance', (req, res) =>{
    res.sendFile(path.join(__dirname, FIELD_VS_DISTANCE_ROOT))
});

app.get('/magnetic-flux', (req, res) => {
    res.sendFile(path.join(__dirname, MAGNETIC_FLUX_ROOT))
})


app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname , '../node_modules/socket.io/client-dist/socket.io.js'));
  });
  console.log(path.join(__dirname , '../node_modules/socket.io/client-dist/socket.io.js'));


//Socket connection
server.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
})


// Serial port initialization
const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 9600
    }
)

const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }))

//Parser listener funcs
parser.on('open',function(){
   console.log('Serial running')
});

parser.on('data',function(data){
    var enc = new TextDecoder();
    var arr = new Uint8Array(data);
    ready = enc.decode(arr)
    console.log(ready)
    io.emit('arduino:data', {
        value: ready
    })
});

port.on('error',function(err){
    console.log(err)
})

//Socket will comunicate the arduino with the web, only localhost
