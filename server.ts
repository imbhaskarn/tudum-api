import { createServer } from 'http';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import app from './src/app';

const PORT = process.env.PORT || 5000;

console.log(process.env.PORT);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket: Socket) => {
  io.emit('message', 'connected to server');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg: string) => {
    console.log(msg);
    io.emit('message', 'the server says: ' + msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
