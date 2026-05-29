# Authentication

The authentication system implements a stateless **JWT-based** flow with full email OTP support and soft-delete account management.

**Base path:** `POST /api/auth/...`

## Auth Flow Overview

```mermaid
sequenceDiagram
    participant C as Client
    participant API as NestJS API
    participant DB as MongoDB
    participant SMTP as Gmail SMTP

    C->>API: POST /auth/register { fullName, email, password }
    API->>DB: Check email uniqueness
    API->>DB: Save user (bcrypt hash, status=1)
    API-->>C: { id, fullName, email, token }

    C->>API: POST /auth/login { email, password }
    API->>DB: Find user by email
    API->>API: bcrypt.compare(password, hash)
    API-->>C: { id, fullName, email, token }

    Note over C,SMTP: Password Reset Flow
    C->>API: POST /auth/forgot-password { email }
    API->>DB: Generate 6-digit OTP (10min expiry)
    API->>SMTP: Send OTP email via Nodemailer
    API-->>C: { message: "OTP sent successfully" }

    C->>API: POST /auth/verify-otp { email, code }
    API->>DB: Validate OTP + expiry
    API->>DB: Generate 32-byte reset token (15min expiry)
    API-->>C: { resetToken }

    C->>API: POST /auth/reset-password { token, password }
    API->>DB: Validate reset token + expiry
    API->>DB: Update password (new bcrypt hash)
    API-->>C: { message: "Password reset successfully" }
```

## Endpoints

### `POST /api/auth/register`

Register a new instructor account. Returns a JWT immediately (no email verification step).

**Request body:**
```json
{
  "FullName": "Dr. Ahmed Hassan",
  "email": "ahmed@university.edu",
  "password": "SecurePass123!"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "6650f1a2b3c4d5e6f7a8b9c0",
    "fullName": "Dr. Ahmed Hassan",
    "email": "ahmed@university.edu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": 200,
  "message": "Success"
}
```

**Error cases:**
- `409 Conflict` — email already registered

---

### `POST /api/auth/login`

Authenticate and receive a JWT token.

**Request body:**
```json
{
  "email": "ahmed@university.edu",
  "password": "SecurePass123!"
}
```

**Response `200 OK`:**
```json
{
  "data": {
    "id": "6650f1a2b3c4d5e6f7a8b9c0",
    "fullName": "Dr. Ahmed Hassan",
    "email": "ahmed@university.edu",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "status": 200,
  "message": "Success"
}
```

**Error cases:**
- `401 Unauthorized` — invalid email or password
- `401 Unauthorized` — account deactivated (soft-deleted)

---

### `POST /api/auth/forgot-password`

Sends a 6-digit OTP to the specified email address. **Never reveals** whether the email exists in the database (prevents enumeration attacks).

**Request body:**
```json
{ "email": "ahmed@university.edu" }
```

**Response `200 OK`:**
```json
{
  "data": { "message": "If the email exists, an OTP has been sent" },
  "status": 200,
  "message": "Success"
}
```

::: tip OTP Behaviour
- OTP is a cryptographically random 6-digit number (`crypto.randomInt`)
- Expires in **10 minutes**
- In `NODE_ENV=development`, the OTP is logged to the server console for easy testing
:::

---

### `POST /api/auth/verify-otp`

Verifies the OTP and issues a short-lived reset token.

**Request body:**
```json
{
  "email": "ahmed@university.edu",
  "code": "483920"
}
```

**Response `200 OK`:**
```json
{
  "data": { "resetToken": "a1b2c3d4e5f6..." },
  "status": 200,
  "message": "Success"
}
```

**Error cases:**
- `400 Bad Request` — invalid or expired OTP

---

### `POST /api/auth/resend-otp`

Resends the OTP (delegates to `forgot-password` internally).

```json
{ "email": "ahmed@university.edu" }
```

---

### `POST /api/auth/reset-password`

Completes the password reset using the token from `verify-otp`.

**Request body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewSecurePass456!"
}
```

**Response `200 OK`:**
```json
{
  "data": { "message": "Password reset successfully" },
  "status": 200,
  "message": "Success"
}
```

**Error cases:**
- `400 Bad Request` — invalid or expired reset token (15-min window)

---

### `POST /api/auth/logout`

🔒 **Requires:** `Authorization: Bearer <token>`

Invalidates the current JWT token.

---

## Using the JWT Token

All protected endpoints require the token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The `JwtAuthGuard` validates the token, and the `@CurrentUser()` decorator extracts the `userId` from the JWT payload:

```typescript
// In any protected controller:
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() userId: string) {
  return this.usersService.findById(userId);
}
```

## Security Details

| Mechanism | Implementation |
|-----------|---------------|
| **Password hashing** | `bcryptjs` with 10 salt rounds |
| **Token signing** | `jsonwebtoken` via `@nestjs/jwt`, algorithm HS256 |
| **Token expiry** | Configurable via `JWT_EXPIRES_IN` (default: `7d`) |
| **OTP generation** | `crypto.randomInt(100000, 999999)` |
| **Reset token** | `crypto.randomBytes(32).toString('hex')` |
| **Email enumeration** | Prevented — forgot-password always returns same message |
| **Soft delete** | `deletedAt` timestamp; login blocked for deactivated accounts |
