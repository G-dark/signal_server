
// import necessary modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PORT } from './config.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } // Ajusta si usas un dominio específico
});

app.get('/', (req, res) => {
  res.send('Servidor de señalización WebRTC activo');
});

io.on('connection', socket => {
  console.log(` Cliente conectado: ${socket.id}`);

  socket.on('join', room => {
    socket.join(room);
    console.log(`🟢 ${socket.id} se unió a la sala: ${room}`);
  });

  socket.on('offer', ({ room, offer }) => {
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', ({ room, answer }) => {
    socket.to(room).emit('answer', answer);
  });

  socket.on('candidate', ({ room, candidate }) => {
    socket.to(room).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
