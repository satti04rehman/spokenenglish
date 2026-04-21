const { Server } = require('socket.io');

let _io = null;

/**
 * Returns the Socket.IO instance (usable from controllers).
 */
const getIO = () => _io;

const setupSocket = (server) => {
  // Configure CORS for Socket.IO - must match Express CORS config
  const allowedOrigins = [];
  
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000');
  }
  
  if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
  }
  
  if (process.env.RAILWAY_URL) {
    allowedOrigins.push(process.env.RAILWAY_URL.replace(/\/$/, ''));
  }
  
  _io = new Server(server, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Add error handler for Socket.IO
  _io.on('connection_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  _io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join room logic strictly by Role
    socket.on('join_class', ({ classId, role, studentId, userName }) => {
      // Store user info on the socket for reference
      socket.user = { classId, role, studentId, userName };

      // Everyone joins the main class room for global broadcasts from teachers
      socket.join(classId);

      if (role === 'admin') {
        // Teachers join a private room to receive student messages securely
        socket.join(`${classId}_teachers`);
      } else {
        // Students join a dedicated private room so teachers can DM them securely
        socket.join(`${classId}_student_${studentId}`);
      }

      console.log(`User ${userName} joined class ${classId} as ${role}`);
    });

    // Handle student sending a message -> ONLY routed to teachers
    socket.on('student_send_message', (data) => {
      if (!socket.user || socket.user.role !== 'student') return;

      const payload = {
        id: Date.now() + Math.random().toString(),
        senderId: socket.user.studentId,
        senderName: socket.user.userName,
        role: socket.user.role,
        text: data.text,
        timestamp: new Date().toISOString()
      };

      // Emit to teachers ONLY
      _io.to(`${socket.user.classId}_teachers`).emit('receive_message', payload);

      // Echo back to the student who sent it so they see it in their own UI
      socket.emit('receive_message', payload);
    });

    // Handle teacher sending a message -> To all or specific student
    socket.on('teacher_send_message', (data) => {
      if (!socket.user || socket.user.role !== 'admin') return;

      const payload = {
        id: Date.now() + Math.random().toString(),
        senderId: socket.user.studentId,
        senderName: socket.user.userName,
        role: 'admin',
        text: data.text,
        timestamp: new Date().toISOString(),
        targetStudentId: data.targetStudentId || 'all'
      };

      if (data.targetStudentId && data.targetStudentId !== 'all') {
        // Direct message to a specific student
        _io.to(`${socket.user.classId}_student_${data.targetStudentId}`).emit('receive_message', payload);
        // Also ensure all teachers see the outbound Direct Message
        _io.to(`${socket.user.classId}_teachers`).emit('receive_message', payload);
      } else {
        // Broadcast to entire class (everyone)
        _io.to(socket.user.classId).emit('receive_message', payload);
        // Echo to teachers directly just in case namespace overlaps
        _io.to(`${socket.user.classId}_teachers`).emit('receive_message', payload);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Clean up user state on disconnect
      if (socket.user) {
        const { classId, studentId, userName, role } = socket.user;
        console.log(`User ${userName} left class ${classId}`);
        
        // Notify others that user left (optional - broadcast to class)
        if (classId) {
          _io.to(classId).emit('user_left', {
            studentId,
            userName,
            role,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Remove socket from all rooms (Socket.IO does this automatically, but explicit for clarity)
      socket.removeAllListeners();
    });
  });

  return _io;
};

module.exports = { setupSocket, getIO };
