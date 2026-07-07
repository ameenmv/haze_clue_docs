# Reports & Dashboard

> 🔒 All endpoints require `Authorization: Bearer <token>`

## Reports

Reports are automatically generated from completed sessions. Each report stores aggregated EEG analytics that power the post-session heatmaps and trend visualizations in the instructor dashboard.

**Base path:** `/api/reports`

### Report Schema

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `ObjectId` | Auto-generated |
| `user` | `ObjectId → User` | Owning instructor |
| `session` | `ObjectId → Session` | Source session |
| `title` | `string` | Report title |
| `data.avgAttention` | `number` | Class-wide average attention score (0–100) |
| `data.peakAttention` | `number` | Highest recorded attention point |
| `data.timeline` | `Array<{ timestamp, attention }>` | Time-series data for chart rendering |
| `data.distribution` | `object` | Attention score distribution buckets |
| `generatedAt` | `Date` | Default: `now()` |

**Database Indexes:** `(user, generatedAt)` compound · `session`

### `GET /api/reports`

List all reports for the authenticated instructor, paginated.

**Query params:**

| Param | Type | Default |
|-------|------|---------|
| `page` | `number` | `1` |
| `limit` | `number` | `10` |

---

### `GET /api/reports/:id`

Retrieve the full detail of a report including the complete `timeline` array for chart rendering.

**Response:**
```json
{
  "data": {
    "_id": "6650c1d2e3f4a5b6c7d8e9f0",
    "title": "Advanced Mathematics — May 29",
    "session": "6650a1b2c3d4e5f6a7b8c9d0",
    "generatedAt": "2026-05-29T15:00:00.000Z",
    "data": {
      "avgAttention": 74.5,
      "peakAttention": 91,
      "timeline": [
        { "timestamp": "2026-05-29T14:05:00.000Z", "attention": 68 },
        { "timestamp": "2026-05-29T14:06:00.000Z", "attention": 72 },
        { "timestamp": "2026-05-29T14:07:00.000Z", "attention": 80 }
      ],
      "distribution": {
        "low": 15,
        "medium": 45,
        "high": 40
      }
    }
  },
  "status": 200,
  "message": "Success"
}
```

---

### `POST /api/reports/generate`

Manually trigger report generation from a completed session's telemetry data.

**Request body:**
```json
{
  "sessionId": "6650a1b2c3d4e5f6a7b8c9d0",
  "title": "Advanced Mathematics — May 29 Report"
}
```

::: tip
Reports can also be exported directly from sessions as PDF or CSV files:
- `GET /api/sessions/:id/export/pdf`
- `GET /api/sessions/:id/export/csv`

See [Sessions API](/docs/backend-web/sessions) for details.
:::

---

## Dashboard

The Dashboard module provides high-level aggregated statistics for the instructor's home screen.

**Base path:** `/api/dashboard`

### `GET /api/dashboard/stats`

Returns aggregated counts and averages for the authenticated instructor.

**Response:**
```json
{
  "data": {
    "totalSessions": 48,
    "activeSessions": 2,
    "totalDevices": 6,
    "connectedDevices": 4,
    "avgAttention": 71.3,
    "totalStudentsMonitored": 892
  },
  "status": 200,
  "message": "Success"
}
```

---

### `GET /api/dashboard/recent-activity`

Returns a chronological list of the instructor's most recent actions and events.

**Response:**
```json
{
  "data": [
    {
      "type": "session_completed",
      "description": "Session 'Grade 11 - Math' completed",
      "timestamp": "2026-05-29T13:45:00.000Z"
    },
    {
      "type": "device_connected",
      "description": "EEG Device 'Set A' came online",
      "timestamp": "2026-05-29T13:00:00.000Z"
    }
  ],
  "status": 200,
  "message": "Success"
}
```

### Users API

Manage the authenticated instructor's profile.

**Base path:** `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/me` | Get current instructor profile |
| `PATCH` | `/users/me` | Update name, phone, avatar URL |
| `PATCH` | `/users/me/password` | Change password (requires current password) |
| `DELETE` | `/users/me` | Soft-delete account (`deletedAt` timestamp) |

---

### Support API

Submit contact and support tickets from the frontend.

**Base path:** `/api/support`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/support/contact` | Creates a new support ticket and sends an email notification to the support team via Nodemailer. |

**Request body (`ContactDto`):**
```json
{
  "fullName": "Instructor Name",
  "email": "instructor@example.com",
  "message": "I need help with my headset.",
  "agree": true
}
```
*Note: `agree` is an optional boolean field to indicate agreement with support terms or privacy policy.*
