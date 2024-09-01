import { sql } from 'drizzle-orm';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import app from './src/app';
import db from './src/db';

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket: Socket) => {
  const roomName = 'some_room';
  socket.join(roomName);
  console.log(`${socket.id} joined room: ${roomName}`);
  console.log('a user connected');

  socket.on('joinUserRoom', (userId) => {
    // Create or join a room bound to the user's ID
    const userRoom = `room_${userId}`;
    socket.join(userRoom);
    console.log(`${socket.id} joined room: ${userRoom}`);
    // Optionally send a confirmation back to the client
    socket.emit('roomJoined', userRoom);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg: string) => {
    console.log(msg);
    io.emit('message', 'the server says: ' + msg);
  });
  socket.on('message', (msg: string) => {
    console.log(msg);
    socket.broadcast.emit('message', { message: msg, sender: socket.id });
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log((await db.execute(sql`SELECT true AS connected`))[0]);
});
