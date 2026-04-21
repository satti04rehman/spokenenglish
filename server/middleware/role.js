const logActivity = require('./activityLogger');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userRole = req.user.role || 'unknown';
    
    if (!roles.includes(userRole)) {
      console.error(`❌ Authorization failed: User role "${userRole}" not in allowed roles [${roles.join(', ')}]`);
      console.error(`   User:`, { id: req.user._id, role: userRole, studentId: req.user.studentId });
      
      // Log access denied attempt
      const ip = req.ip || req.connection.remoteAddress;
      logActivity(
        req.user._id, 
        'access_denied', 
        null, 
        `Attempted access to ${req.path} with role ${userRole} (Required: ${roles.join(', ')})`,
        ip,
        false,
        'Insufficient permissions'
      );
      
      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

module.exports = authorize;
