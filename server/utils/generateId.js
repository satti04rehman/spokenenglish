const User = require('../models/User');

const generateStudentId = async () => {
  const year = new Date().getFullYear();
  const prefix = `ENG-${year}-`;

  // Find the last student ID for the current year
  const lastStudent = await User.findOne({
    studentId: { $regex: `^${prefix}` }
  }).sort({ studentId: -1 });

  let nextNumber = 1;
  if (lastStudent && lastStudent.studentId) {
    const lastNumber = parseInt(lastStudent.studentId.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `${prefix}${paddedNumber}`;
};

module.exports = generateStudentId;
