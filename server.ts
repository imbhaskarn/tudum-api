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
  io.emit('message', 'connected to server',);
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('message', (msg: string) => {
    console.log(msg);
    io.emit('message', 'the server says: ' + msg);
  });
  socket.on('message', (msg: string) => {
    console.log(msg);
    io.emit('message', msg);
  });
});

server.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log((await db.execute(sql`SELECT true AS connected`))[0]);
});
