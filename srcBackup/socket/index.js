import { Server } from 'socket.io';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    }
  });

  const chatHandler = {
    emitNewMessage: (roomId, message) => {
      io.to(`room_${roomId}`).emit('new_message', message);
    },
    emitTyping: (roomId, userId) => {
      io.to(`room_${roomId}`).emit('typing', { userId });
    }
  };

  const unreadCountHandler = {
    emitUnreadCount: (userId, count) => {
      io.to(`user_${userId}`).emit('unread_count', { count });
    }
  };

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join_room', (roomId) => {
      socket.join(`room_${roomId}`);
    });

    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return { io, chatHandler, unreadCountHandler };
};
