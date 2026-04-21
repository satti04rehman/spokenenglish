const ActivityLog = require('../models/ActivityLog');

/**
 * Enhanced activity logging with support for error tracking and failed attempts
 * @param {string} userId - User ID performing the action
 * @param {string} action - Action name (e.g., 'login', 'create_student', 'approve_permission')
 * @param {string} classId - Class ID (optional)
 * @param {string} details - Additional details about the action
 * @param {string} ipAddress - IP address of the requester
 * @param {boolean} success - Whether the action succeeded (default: true)
 * @param {string} error - Error message if action failed (optional)
 */
const logActivity = async (userId, action, classId = null, details = null, ipAddress = null, success = true, error = null) => {
  try {
    const logEntry = {
      userId,
      action,
      classId,
      details: details || '',
      ipAddress: ipAddress || 'unknown',
      timestamp: new Date()
    };

    // Add success/failure tracking
    if (success === false) {
      logEntry.details = `FAILED: ${details} ${error ? `(Error: ${error})` : ''}`.trim();
    }

    const log = await ActivityLog.create(logEntry);
    
    // Log critical security events to console
    if (!success || ['login', 'login_failed', 'access_denied', 'permission_denied'].includes(action)) {
      console.log(`[ACTIVITY] ${action} - User: ${userId} - Success: ${success} - IP: ${ipAddress}`);
    }

    return log;
  } catch (error) {
    console.error('Activity logging error:', error.message);
    // Don't throw - logging should not break the application
  }
};

module.exports = logActivity;
