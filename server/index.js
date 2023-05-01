// Server initialization
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const TEMPLATE_ROOT = '../client/template';
var serialConnected = true;

const { SerialPort } = require('serialport')
const { DelimiterParser } = require('@serialport/parser-delimiter')
app.get('/',(req,res,next)=>{
    res.sendFile(TEMPLATE_ROOT +'/index.html')
})

// // Serial port initialization
const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 9600
    }
)

const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }))

//Parser listener funcs
parser.on('open',function(){
    showModal('success', 'Serial running', 2000);
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

// Interactive button to indicate if we're connected to the serial port
function changeButtonColor() {

  var button = document.getElementById("serialButton");
  var button_in_red = button.classList.contains("btn-inverse-danger");
  var button_in_green = button.classList.contains("btn-inverse-success");

  if (button_in_red) {

    button.classList.remove("btn-inverse-danger");
    button.classList.add("btn-inverse-success");
    button.innerText = "Run serial";
    showModal('success', 'Conexión serial terminada', 2000);

  }else if (button_in_green && !serialConnected){
    showModal('error', 'No hay ningún serial conectado', 2000);
  }else if (button_in_green && serialConnected) {

    button.classList.remove("btn-inverse-success");
    button.classList.add("btn-inverse-danger");
    button.innerText = "Stop serial";

    showModal('success', 'Conexión serial iniciada', 2000);
  }

}

// Connection modal function
function showModal(icon, text, delay) {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: delay,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: icon,
            title: text
        });
}