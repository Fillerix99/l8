var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var stdin = process.stdin;

var spawn = require('child_process').spawn,
    py    = spawn('python', ['readmifare.py']),

    py.stdout.on('data', function(data){
  console.log(data);
});

var elev = "Filip Nyquist";
stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

// Döda programmet on Ctrl+C trycks
stdin.on( 'data', function( key ){

  if ( key === '\u0003' ) {
    process.exit();
  }
  if ( key === '\u0070' ) {
    console.log("Skickar testdata!");
    io.sockets.emit('update-msg', { data: 'Välkommen '+ elev + '!' });
    setTimeout(function() {
    io.sockets.emit('update-msg', { data: 'Vänligen Scanna Ditt Kort' });
}, 3000);
}});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('En Användare Anslöt till Hemsidan');
});



http.listen(3000, function(){
  console.log('Lyssnar på *:3000');
});
