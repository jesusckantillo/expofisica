// WE DON't EVEN KNOW WHAT WE DOIN BUT WE UPPPPPPP!!!!!!!(insert'fire'emoji')
const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { SerialPort } = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const server = http.createServer(app);
const io = require('socket.io')(server);

const STATIC_ROOT = path.join(__dirname, '../client/template');
const INDEX_ROOT = path.join(STATIC_ROOT, 'index.html');
const FIELD_VS_DISTANCE_ROOT = path.join(STATIC_ROOT, 'field-vs-distance.html');
const MAGNETIC_FLUX_ROOT = path.join(STATIC_ROOT, 'magnetic-flux.html');

app.set('port', process.env.PORT || 3000);
app.use(express.static(STATIC_ROOT));

app.get('/', (req, res) => {
  res.sendFile(INDEX_ROOT);
});

app.get('/field-vs-distance', (req, res) => {
  res.sendFile(FIELD_VS_DISTANCE_ROOT);
});

app.get('/magnetic-flux', (req, res) => {
  res.sendFile(MAGNETIC_FLUX_ROOT);
});

app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));

server.listen(app.get('port'), () => {
  console.log('Server listening on port', app.get('port'));
});

io.on('connection', (socket) => {
  console.log('A new socket connected');
});

//Serial port initialization (par el arduino xdxddx)
const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }));

//Parser listener funcs
parser.on('open', () => {
  console.log('Serial port open');
});

parser.on('data', (data) => {
  const enc = new TextDecoder();
  const arr = new Uint8Array(data);
  const ready = enc.decode(arr);
  console.log(ready);
  io.emit('arduino:data', {
    value: ready
  });
});

port.on('error', (err) => {
  console.log(err);
});
