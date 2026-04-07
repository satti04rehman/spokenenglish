# Permission Request & Control System

## Overview
This feature allows students to request permissions for microphone, camera, and screen sharing during live classes. Teachers can approve, deny, or revoke these permissions with granular control over visibility scope.

## Architecture

### Database Model: `PermissionRequest`
Located in `server/models/PermissionRequest.js`

**Fields:**
- `classId` - Reference to the class
- `studentId` - Reference to the requesting student
- `teacherId` - Reference to the class teacher
- `requestType` - Type of permission: `'microphone' | 'camera' | 'screen'`
- `status` - Request state: `'pending' | 'approved' | 'denied' | 'revoked'`
- `visibility` - Scope of access: `'individual' | 'class'`
  - `'individual'`: Only teacher can see/hear
  - `'class'`: Entire class can see/hear
- `approvedAt` - Timestamp when teacher approved
- `deniedAt` - Timestamp when teacher denied
- `denialReason` - Reason provided by teacher for denial
- `requestedAt` - When student made the request
- `expiresAt` - Auto-revoke after session ends

**Indexes:**
- Compound index on `(classId, studentId, requestType, status)` - Prevents duplicate active requests
- Index on `(teacherId, classId, status)` - Fast teacher queries
- Index on `(studentId, classId)` - Fast student queries

---

## API Endpoints

### Student Endpoints

#### 1. Request Permission
```
POST /api/permissions/request
Authorization: Required (Student)

Body:
{
  "classId": "ObjectId",
  "requestType": "microphone|camera|screen"
}

Response:
{
  "message": "Microphone permission requested. Waiting for teacher approval.",
  "request": { ...PermissionRequest }
}

Status Codes:
- 201: Request created successfully
- 400: Invalid request type or already has active permission
- 403: Student not enrolled in class
- 429: Request recently denied (cannot spam requests)
- 404: Class not found
```

#### 2. View Student's Own Requests
```
GET /api/permissions/my-requests/:classId
Authorization: Required (Student)

Response:
{
  "classId": "ObjectId",
  "requests": [...],
  "grouped": {
    "pending": [...],
    "approved": [...],
    "denied": [...],
    "revoked": [...]
  },
  "summary": {
    "pendingCount": 2,
    "approvedCount": 1,
    "deniedCount": 0
  }
}
```

#### 3. Check Permission Status
```
GET /api/permissions/status/:classId/:requestType
Authorization: Required (Student)

Response:
{
  "allowed": true,
  "requestType": "microphone",
  "visibility": "individual|class",
  "approvedAt": "2026-04-06T12:00:00.000Z",
  "message": "Microphone is shared with entire class"
}
```

---

### Teacher Endpoints

#### 1. Get All Pending/Approved Requests for Class
```
GET /api/permissions/requests/:classId
Authorization: Required (Teacher/Admin)

Response:
{
  "classId": "ObjectId",
  "requests": [...all pending and approved],
  "grouped": {
    "pending": [...],
    "approved": [...]
  },
  "summary": {
    "pendingCount": 3,
    "approvedCount": 2
  }
}
```

#### 2. Approve Permission Request
```
PATCH /api/permissions/requests/:requestId/approve
Authorization: Required (Teacher/Admin)

Body:
{
  "visibility": "individual|class"  // Default: 'individual'
}

Response:
{
  "message": "Microphone permission approved for John Doe.",
  "request": { ...PermissionRequest with status='approved' }
}
```

#### 3. Deny Permission Request
```
PATCH /api/permissions/requests/:requestId/deny
Authorization: Required (Teacher/Admin)

Body:
{
  "reason": "Optional denial reason"
}

Response:
{
  "message": "Microphone permission denied for John Doe.",
  "request": { ...PermissionRequest with status='denied' }
}
```

#### 4. Revoke Previously Approved Permission
```
PATCH /api/permissions/requests/:requestId/revoke
Authorization: Required (Teacher/Admin)

Response:
{
  "message": "Microphone permission revoked for John Doe.",
  "request": { ...PermissionRequest with status='revoked' }
}
```

---

## Frontend Components

### 1. Student Request Panel
**File:** `client/src/components/PermissionRequestPanel.jsx`

**Features:**
- Shows current permission status for each media type
- Request buttons for pending permissions
- Displays denial reasons
- Visual badges for status (Pending, Enabled, Denied)
- Floating panel (bottom-right corner)
- Can be minimized/expanded

**Props:**
- `classId` (string, required) - Class ID
- `isVisible` (boolean) - Whether panel starts visible, default: true

**Usage:**
```jsx
<PermissionRequestPanel classId={classId} isVisible={true} />
```

---

### 2. Teacher Permission Panel
**File:** `client/src/components/TeacherPermissionPanel.jsx`

**Features:**
- Real-time notification badge showing pending request count
- Lists all pending requests with student info
- Approve button - opens modal to select visibility scope
- Deny button - opens modal for denial reason
- Visual icons for different media types
- Auto-polls for new requests (5-second interval)
- Collapsible notification bell when no requests
- Approved requests section

**Props:**
- `classId` (string, required) - Class ID
- `isVisible` (boolean) - Whether panel starts visible
- `onRequestUpdate` (callback) - Called after approve/deny action

**Usage:**
```jsx
<TeacherPermissionPanel classId={classId} isVisible={true} onRequestUpdate={() => console.log('Updated')} />
```

---

### 3. Permission Hook (Student)
**File:** `client/src/hooks/usePermissions.js`

**Functions:**
- `checkStatus(requestType)` - Check if student has permission
- `requestPermission(requestType)` - Make new request
- `getMyRequests()` - Fetch all student's requests

**Usage:**
```jsx
const { permissionStatus, checkStatus, requestPermission, requests } = usePermissions(classId);
```

---

### 4. Permission Hook (Teacher)
**File:** `client/src/hooks/useTeacherPermissions.js`

**Functions:**
- `fetchRequests()` - Get all pending/approved requests
- `approveRequest(requestId, visibility)` - Approve with scope
- `denyRequest(requestId, reason)` - Deny with optional reason
- `revokePermission(requestId)` - Revoke active permission

**Usage:**
```jsx
const { pendingRequests, approvedRequests, approveRequest, denyRequest, revokePermission } = useTeacherPermissions(classId);
```

---

## Integration with Jitsi Meet

The feature is integrated in `client/src/pages/JitsiClassRoom.jsx`:

```jsx
{user?.role === 'student' && <PermissionRequestPanel classId={id} isVisible={true} />}
{user?.role === 'teacher' && <TeacherPermissionPanel classId={id} isVisible={true} />}
```

### Control Flow

**Student Side:**
1. Student enters class and sees permission panel
2. Clicks "Request Permission" for mic/camera/screen
3. Request sent to backend
4. Waits for teacher approval
5. Once approved, can use the feature
6. If denied, sees denial reason and can request again after 5 minutes

**Teacher Side:**
1. Teacher gets notification badge with count
2. Clicks notification to expand panel
3. Sees list of pending requests
4. Clicks "Approve" - selects if only for teacher or whole class
5. Or clicks "Deny" - optionally provides reason
6. Can also revoke previously approved permissions

---

## Security Features

1. **Duplicate Prevention:** Only one active request per student per media type
2. **Rate Limiting on Requests:** Cannot request again if denied (5-minute cooldown)
3. **Role-Based Access:** Only teachers can approve/deny their own class requests
4. **Activity Logging:** All permission actions logged to activity trail
5. **Enrollment Verification:** Students must be enrolled in class to request
6. **Token Validation:** All endpoints protected with authentication

---

## Visibility Scopes Explained

### Individual (Default)
- Only the teacher can see/hear the student's media
- Useful for:
  - One-on-one Q&A
  - Individual student interviews
  - Privacy-sensitive discussions
  - Assessing individual students

### Class
- All students and teacher can see/hear the media
- Useful for:
  - Peer presentations
  - Group discussions
  - Whole-class participation
  - Collaborative activities

---

## Error Handling

### Common Errors

**"You already have permission for this"** (400)
- Student already has approved permission
- Action: Request different media type or wait for teacher to revoke

**"You already have a pending request for this"** (400)
- Request already submitted, awaiting approval
- Action: Wait for teacher response (no need to re-request)

**"Your request was recently denied"** (429)
- Request denied 5 minutes ago, prevent spam
- Action: Wait before attempting again

**"Not enrolled in this class"** (403)
- Student trying to request in class not enrolled in
- Action: Check enrollment status

**"Access denied"** (403)
- Teacher trying to manage request for another teacher's class
- Action: Only manage your own class requests

---

## Activity Logging

All permission actions are logged:
- `request_permission` - Student requests permission
- `approve_permission` - Teacher approves (with visibility scope)
- `deny_permission` - Teacher denies (with reason)
- `revoke_permission` - Teacher revokes active permission

View in Activity Logs with full audit trail.

---

## Testing

### Test Scenarios

**Test 1: Student Request Flow**
1. Student logs in and joins class
2. Clicks "Request Permission" for microphone
3. See "Pending" status
4. Teacher approves with "individual" scope
5. Status changes to "Enabled"

**Test 2: Denial & Retry**
1. Student requests camera
2. Teacher denies with reason "Screen sharing in progress"
3. Student sees denial reason
4. Try again immediately → blocked for 5 minutes
5. After 5 minutes, can request again

**Test 3: Class Visibility**
1. Student requests screen share
2. Teacher approves with "class" scope
3. All students can see the screen share
4. Teacher can revoke anytime

**Test 4: Multiple Requests**
1. One teacher manages multiple student requests
2. Notification shows "5" pending
3. Approve some, deny others
4. All logged in activity trail

---

## Future Enhancements

- [ ] WebSocket integration for real-time notifications (instead of polling)
- [ ] Recording permissions separate from live permissions
- [ ] Time-based auto-revoke (e.g., permission expires after 10 minutes)
- [ ] Preset denial reasons (dropdown)
- [ ] Batch approve/deny operations
- [ ] Permission analytics & reports
- [ ] Student "raise hand" feature before requesting
- [ ] Jitsi API integration to enforce permissions programmatically
