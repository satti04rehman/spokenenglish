# Permission System - Quick Reference Card

## 🚀 Quick Start

### Run the System
```bash
# Start backend
cd server
npm run dev

# In another terminal, start frontend
cd client
npm run dev

# Access at http://localhost:5173
```

---

## 📡 API Quick Reference

### Request Permission (Student)
```bash
curl -X POST http://localhost:5000/api/permissions/request \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classId":"ID","requestType":"microphone"}'
```
**Request Types:** `microphone`, `camera`, `screen`

### Get Pending Requests (Teacher)
```bash
curl -X GET http://localhost:5000/api/permissions/requests/ID \
  -H "Authorization: Bearer TOKEN"
```

### Approve (Teacher)
```bash
curl -X PATCH http://localhost:5000/api/permissions/requests/ID/approve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"visibility":"individual"}'
```
**Visibility:** `individual` (teacher only) or `class` (all see)

### Deny (Teacher)
```bash
curl -X PATCH http://localhost:5000/api/permissions/requests/ID/deny \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Optional reason"}'
```

### Check Status (Student)
```bash
curl -X GET http://localhost:5000/api/permissions/status/classId/microphone \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔧 Component Quick Reference

### Use in Student Class
```jsx
import PermissionRequestPanel from '../components/PermissionRequestPanel';

<PermissionRequestPanel classId={classId} isVisible={true} />
```

### Use in Teacher Class
```jsx
import TeacherPermissionPanel from '../components/TeacherPermissionPanel';

<TeacherPermissionPanel classId={classId} isVisible={true} />
```

### Use Hooks
```jsx
// Student
import usePermissions from '../hooks/usePermissions';
const { permissionStatus, checkStatus, requestPermission } = usePermissions(classId);

// Teacher
import useTeacherPermissions from '../hooks/useTeacherPermissions';
const { pendingRequests, approveRequest, denyRequest } = useTeacherPermissions(classId);
```

---

## 🗂️ File Structure

```
server/
├── models/
│   └── PermissionRequest.js          [NEW]
├── controllers/
│   └── permissionController.js       [NEW]
├── routes/
│   └── permissions.js                [NEW]
└── server.js                         [MODIFIED]

client/src/
├── components/
│   ├── PermissionRequestPanel.jsx    [NEW]
│   └── TeacherPermissionPanel.jsx    [NEW]
├── hooks/
│   ├── usePermissions.js             [NEW]
│   └── useTeacherPermissions.js      [NEW]
└── pages/
    └── JitsiClassRoom.jsx            [MODIFIED]

Documentation/
├── PERMISSIONS_FEATURE.md            [NEW]
├── TESTING_PERMISSIONS.md            [NEW]
├── PERMISSION_SYSTEM_SUMMARY.md      [NEW]
└── PERMISSION_QUICK_REFERENCE.md     [THIS FILE]
```

---

## 🔑 Key Concepts

### Request Status
| Status | Meaning | Student Action |
|--------|---------|-----------------|
| `pending` | Waiting for teacher | Wait |
| `approved` | Teacher said yes | Use feature |
| `denied` | Teacher said no | Wait 5 min, retry |
| `revoked` | Teacher removed access | Request again |

### Visibility Scope
| Value | Meaning | Best For |
|-------|---------|----------|
| `individual` | Only teacher sees/hears | Private Q&A, screening |
| `class` | Everyone sees/hears | Presentations, group work |

---

## 🎯 Common Tasks

### Task: Check if Student Has Permission
```javascript
const { allowed, visibility } = await api.get(`/permissions/status/${classId}/microphone`);
if (allowed) {
  console.log(`Approved (${visibility})`);
}
```

### Task: Get All Student Requests in a Class
```javascript
const res = await api.get(`/permissions/my-requests/${classId}`);
console.log(res.data.grouped); // { pending, approved, denied, revoked }
```

### Task: Handle Approval in Teacher Panel
```javascript
const handleApprove = async () => {
  await api.patch(`/permissions/requests/${requestId}/approve`, {
    visibility: 'class' // or 'individual'
  });
};
```

### Task: Handle Denial in Teacher Panel
```javascript
const handleDeny = async () => {
  await api.patch(`/permissions/requests/${requestId}/deny`, {
    reason: 'Screen share in progress'
  });
};
```

---

## ⚠️ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Not enrolled in this class` | Student not enrolled | Teacher must enroll student |
| `You already have permission` | Already approved | No need to request again |
| `Too many requests` (429) | Denied <5 min ago | Wait 5 minutes |
| `Access denied` | Wrong role | Ensure teacher managing own class |
| Panel not showing | Not in live class | Start class, student must join |

---

## 🧪 Test Commands

### Test Student Request
```bash
# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"studentId":"STUD-001","password":"pass123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

# 2. Request microphone
curl -X POST http://localhost:5000/api/permissions/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classId":"CLASS_ID","requestType":"microphone"}'
```

### Test Teacher Approval
```bash
# 1. Get pending requests
curl -X GET http://localhost:5000/api/permissions/requests/CLASS_ID \
  -H "Authorization: Bearer TEACHER_TOKEN"

# 2. Approve from response
curl -X PATCH http://localhost:5000/api/permissions/requests/REQUEST_ID/approve \
  -H "Authorization: Bearer TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"visibility":"class"}'
```

---

## 📊 Database Queries

### Count Pending Requests
```javascript
db.permissionrequests.countDocuments({ status: 'pending' })
```

### Find Requests for Teacher
```javascript
db.permissionrequests.find({ teacherId: ObjectId('...') })
```

### Find Requests for Class
```javascript
db.permissionrequests.find({ classId: ObjectId('...'), status: 'pending' })
```

### Check Recent Denials (Spam Prevention)
```javascript
db.permissionrequests.find({
  status: 'denied',
  deniedAt: { $gt: new Date(Date.now() - 5*60*1000) }
})
```

---

## 🎨 UI Elements

### Student Panel States

**Idle State:**
- Button: "Request Permission"
- Badge: "Not Enabled"

**Pending State:**
- Button: Disabled
- Badge: "⏳ Pending"
- Message: "Waiting for teacher approval"

**Approved State:**
- Badge: "✓ Enabled (Class/Individual)"
- Button: Hidden
- Timestamp: Shows approval time

**Denied State:**
- Badge: "✗ Denied"
- Message: Shows denial reason
- Button disabled for 5 minutes

---

### Teacher Panel States

**No Requests:**
- Message: "✓ All caught up!"
- Bell: Hidden (shows as minimized button)

**Pending Requests:**
- Bell: Shows count badge "3"
- List: Shows all pending requests
- Actions: Approve / Deny buttons

**Approved Requests:**
- Tab/Section: Shows approved with visibility scope
- Actions: Revoke button available

---

## 🔐 Security Checklist

✅ Only students enrolled in class can request
✅ Only class teacher can approve their own class
✅ Cannot make duplicate active requests
✅ 5-minute cooldown prevents spam
✅ All actions logged to activity trail
✅ JWT token required for all endpoints
✅ Role-based authorization enforced
✅ Teacher ownership verified before approval

---

## 🚀 Deployment Checklist

Before going live:
- [ ] Backend running on production server
- [ ] MongoDB connection verified
- [ ] Frontend built and deployed
- [ ] Environment variables set (.env)
- [ ] CORS configured properly
- [ ] Rate limiting active
- [ ] Activity logging working
- [ ] Test with real users
- [ ] Monitor performance
- [ ] Document for users

---

## 📞 Debug Info

### Check Backend Logs
```bash
cd server
npm run dev
# Watch for "GET /api/permissions" requests
```

### Check Frontend Logs
```bash
# Open browser DevTools
F12 → Console tab
# Look for "usePermissions" or "PermissionRequestPanel"
```

### Check Database
```bash
mongosh
use spoken-english-db
db.permissionrequests.find().pretty()
```

---

## 📚 Full Documentation
- **Full Technical Docs:** `PERMISSIONS_FEATURE.md`
- **Testing Guide:** `TESTING_PERMISSIONS.md`
- **Implementation Summary:** `PERMISSION_SYSTEM_SUMMARY.md`

---

**Last Updated:** April 6, 2026
**Status:** ✅ Production Ready
**Version:** 1.0
