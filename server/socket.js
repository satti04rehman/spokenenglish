const { Server } = require('socket.io');

let _io = null;

/**
 * Returns the Socket.IO instance (usable from controllers).
 */
const getIO = () => _io;

const setupSocket = (server) => {
  _io = new Server(server, {
    cors: {
      origin: '*', // Handled globally by Helmet/Express but wildcarded for websockets fallback
      methods: ['GET', 'POST']
    }
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
    });
  });

  return _io;
};

module.exports = { setupSocket, getIO };
