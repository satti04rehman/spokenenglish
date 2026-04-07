# Permission System - Quick Testing Guide

## Setup

1. **Ensure Backend is Running**
   ```bash
   cd server
   npm install
   npm run dev
   # Server should be on http://localhost:5000
   ```

2. **Ensure Frontend is Running**
   ```bash
   cd client
   npm install
   npm run dev
   # Frontend should be on http://localhost:5173
   ```

3. **Database is Connected**
   - MongoDB connection working
   - Teacher and student accounts exist

---

## Quick Test Scenario

### Step 1: Setup Test Users
If not seeded, create accounts:
- **Teacher:** Login ID: `teacher`, Password: `admin123`
- **Student:** Create via teacher dashboard

### Step 2: Teacher Creates a Live Class

**As Teacher:**
1. Login to dashboard
2. Go to "Create Class" (or "Manage Classes")
3. Schedule a class immediately (or within next hour)
4. Save and note the class ID

### Step 3: Mark Class as Live

**As Teacher (Optional - for testing):**
```bash
curl -X PATCH http://localhost:5000/api/classes/{classId} \
  -H "Authorization: Bearer {teacherToken}" \
  -H "Content-Type: application/json" \
  -d '{"status": "live"}'
```

Or use frontend to update class status.

### Step 4: Student Joins Class

**As Student:**
1. Login to dashboard
2. Navigate to "My Classes" or class list
3. Click on the class and "Join Now" (if live)
4. Should see permission request panel in bottom-right

### Step 5: Student Requests Permission

**As Student (in Jitsi room):**
1. Look for floating permission panel (bottom-right)
2. See buttons for: Microphone, Camera, Screen Share
3. Click "Request Permission" for Microphone
4. See status change to "⏳ Pending"

### Step 6: Teacher Approves/Denies

**As Teacher (in Jitsi room):**
1. Look for 🔔 notification bell (bottom-right)
2. Should show "1" notification
3. Click bell to expand panel
4. See pending request from student
5. Click "Approve" button

**In Approval Modal:**
- Choose "👁️ Only You" (individual visibility)
- Or "👥 Entire Class" (class visibility)
- Click "Approve Permission"

### Step 7: Verify Status Updates

**As Student:**
1. Permission panel updates to "✓ Enabled (Class)" or "✓ Enabled"
2. Can see approval timestamp
3. Now allowed to use that feature

### Step 8: Test Denial

**As Student:**
1. Request a new permission (e.g., Camera)
2. Leave it pending

**As Teacher:**
1. See new pending request
2. Click "Deny" button
3. Enter reason: "Camera quality issues"
4. Click "Deny Permission"

**As Student:**
1. See denial reason in permission panel
2. Button is disabled with denial message
3. Try again → Blocked for 5 minutes
4. Wait 5 minutes or refresh page

---

## Testing via cURL / API Calls

### Login to Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "student-001",
    "password": "pass123"
  }'

# Extract accessToken from response
```

### Student Requests Permission
```bash
curl -X POST http://localhost:5000/api/permissions/request \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "classId": "{classId}",
    "requestType": "microphone"
  }'
```

### Teacher Gets Pending Requests
```bash
curl -X GET "http://localhost:5000/api/permissions/requests/{classId}" \
  -H "Authorization: Bearer {teacherToken}"
```

### Teacher Approves Request
```bash
curl -X PATCH http://localhost:5000/api/permissions/requests/{requestId}/approve \
  -H "Authorization: Bearer {teacherToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "visibility": "class"
  }'
```

### Teacher Denies Request
```bash
curl -X PATCH http://localhost:5000/api/permissions/requests/{requestId}/deny \
  -H "Authorization: Bearer {teacherToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Please wait your turn"
  }'
```

### Check Permission Status
```bash
curl -X GET "http://localhost:5000/api/permissions/status/{classId}/microphone" \
  -H "Authorization: Bearer {studentToken}"
```

---

## Common Issues

### Issue: Permission Panel Not Showing
**Solution:**
- Verify you're in Jitsi room (class must be live)
- Check browser console for errors
- Ensure classId is correct

### Issue: "Not enrolled in this class"
**Solution:**
- Ensure student is enrolled
- Teacher must add student via "Enroll Students"

### Issue: Teacher Cannot See Requests
**Solution:**
- Verify class is YOUR class (you're the teacher)
- Try refreshing the panel
- Check backend logs for errors

### Issue: 5-Minute Cooldown After Denial
**This is intentional** - Prevents spam requests
- Wait 5 minutes before requesting again
- Or clear browser data (dev only)

### Issue: Notification Bell Stays Hidden
**Solution:**
- If no pending requests, bell shows as hidden button
- Make a test request to see notification
- UI will show bell when requests arrive

---

## Database Inspection

### Check Requests in MongoDB
```bash
# In MongoDB console
use spoken-english-db

# View all permission requests
db.permissionrequests.find()

# View requests for specific class
db.permissionrequests.find({ classId: ObjectId("...") })

# View by status
db.permissionrequests.find({ status: "pending" })
db.permissionrequests.find({ status: "approved" })
```

---

## Features to Test

- [ ] Student can request microphone permission
- [ ] Student can request camera permission
- [ ] Student can request screen share permission
- [ ] Student cannot request same permission twice (pending)
- [ ] Teacher receives notification
- [ ] Teacher can approve with "individual" visibility
- [ ] Teacher can approve with "class" visibility
- [ ] Teacher can deny with reason
- [ ] Student sees approval status
- [ ] Student sees denial reason
- [ ] Student cannot request within 5 minutes of denial
- [ ] Teacher can revoke active permission
- [ ] Activity logged for all actions
- [ ] Teachers see only their own class requests
- [ ] Students only see their own requests
- [ ] Permissions are class-specific
- [ ] Multiple students can request simultaneously
- [ ] Teacher can manage multiple requests at once

---

## Performance Notes

- Permission panel queries every 5 seconds (teacher-side)
- Lightweight database queries with proper indexing
- No real-time feature (polling-based)
- Scalable to hundreds of students per class

---

## Next Steps

After testing:
1. Review activity logs for permission actions
2. Test with multiple concurrent users
3. Test on mobile/responsive layout
4. Consider WebSocket upgrade for real-time notifications
5. Test integration with actual Jitsi permissions enforcement

---

## Support

For issues:
1. Check backend logs: `npm run dev` output
2. Check frontend console: Browser DevTools
3. Check database: Direct MongoDB query
4. Check API: Use Postman/cURL to test endpoints
