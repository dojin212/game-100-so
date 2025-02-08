const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost", // Đổi thành URL website của bạn khi deploy
        methods: ["GET", "POST"]
    }
});

let currentNumber = 1;
let players = 0;
let turn = 1;

io.on('connection', (socket) => {
    console.log('Người chơi kết nối:', socket.id);
    players++;

    if (players > 2) {
        socket.emit('full', { message: 'Trò chơi đã đủ 2 người' });
        socket.disconnect();
        return;
    }

    socket.on('selectNumber', ({ number, player }) => {
        if (number === currentNumber && player === turn) {
            io.emit('numberSelected', { number, player });
            currentNumber++;
            turn = turn === 1 ? 2 : 1;
        }
    });

    socket.on('disconnect', () => {
        console.log('Người chơi rời khỏi:', socket.id);
        players--;
    });
});

server.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});