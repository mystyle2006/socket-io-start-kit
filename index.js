const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let existNameList = {};
let nameTable = {};
io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    socket.broadcast.emit('onOut', `${nameTable[socket.id]} 님이 채팅방에서 나가셨습니다.`)
  });

  socket.on('onBoarding', (userName) => {
    if (existNameList[userName]) {
      existNameList[userName] += 1;
    } else {
      existNameList[userName] = 1;
    }

    nameTable[socket.id] = userName;
    socket.broadcast.emit('onBoardingReceiver', { msg: `${userName} ${existNameList[userName]}님이 채팅방에 접속하셨습니다.`, userName: `${userName} ${existNameList[userName]}`});
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      name: nameTable[socket.id],
      msg,
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
