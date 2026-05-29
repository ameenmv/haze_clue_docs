# Deployment & Environment

## Production Environment

| Property | Value |
|----------|-------|
| **Platform** | Vercel (Serverless Functions) |
| **Base URL** | `https://haze-clue-backend.vercel.app/api` |
| **Runtime** | Node.js 22.x |
| **API Prefix** | `/api` (all routes) |
| **CORS Origins** | `localhost:3000`, `localhost:3003`, `hazeclue.netlify.app` |

## Environment Variables

Create a `.env` file at the project root. Copy from `.env.example`:

```bash
cp .env.example .env
```

### Core Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | ✅ | JWT signing secret (use a long random string in production) | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | ❌ | Token lifetime | `7d` |
| `PORT` | ❌ | Server port (Vercel ignores this) | `3001` |
| `NODE_ENV` | ❌ | Environment mode | `development` |

### CORS Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FRONTEND_URL` | ❌ | Primary allowed frontend origin | `http://localhost:3003/` |
| `CORS_ORIGINS` | ❌ | Comma-separated list of all allowed origins | `http://localhost:3000,...` |

### Pusher Variables

| Variable | Required | Description | Value |
|----------|----------|-------------|-------|
| `PUSHER_APP_ID` | ✅ | Pusher application ID | `2158304` |
| `PUSHER_KEY` | ✅ | Pusher public key | `aa0fca879ef3879464ff` |
| `PUSHER_SECRET` | ✅ | Pusher secret key | `58e1f0b558202629c3bf` |
| `PUSHER_CLUSTER` | ✅ | Pusher cluster region | `eu` |

### SMTP Variables (Email / OTP)

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_HOST` | ❌ | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | SMTP server port | `587` |
| `SMTP_USER` | ❌ | SMTP username (Gmail address) | `your@gmail.com` |
| `SMTP_PASS` | ❌ | SMTP password (App Password for Gmail) | `xxxx xxxx xxxx xxxx` |

### Feature Flags

| Variable | Required | Description |
|----------|----------|-------------|
| `USE_SIMULATION` | ❌ | Enable synthetic EEG data generation for demos | `true` |

::: warning Security Note
Never commit your `.env` file to version control. The `.gitignore` already excludes it.
In production, set all variables directly in the Vercel dashboard under **Project Settings → Environment Variables**.
:::

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/HazeClue/Haze_clue_backend.git
cd Haze_clue_backend

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and Pusher credentials

# 4. Start dev server with hot reload
pnpm run start:dev
```

The API will be available at: `http://localhost:3001/api`

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run start:dev` | Start with hot reload (watch mode) |
| `pnpm run start:debug` | Start with Node.js debugger attached |
| `pnpm run build` | Compile TypeScript → JavaScript (`dist/`) |
| `pnpm run start:prod` | Run compiled production build |
| `pnpm run lint` | Run ESLint across the project |
| `pnpm run test` | Run unit tests (Jest) |
| `pnpm run test:e2e` | Run end-to-end tests |
| `pnpm run test:cov` | Generate test coverage report |

## Vercel Configuration

The project uses a `vercel.json` configuration to map all routes to the NestJS handler:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

## Docker Support

A `Dockerfile` is included for containerized deployments:

```bash
# Build the image
docker build -t hazeclue-backend .

# Run the container
docker run -p 3001:3001 --env-file .env hazeclue-backend
```

## Health Check

Verify the API is running:

```bash
curl https://haze-clue-backend.vercel.app/api
# → { "status": "OK", "service": "HazeClue API" }
```

## Postman Collection

Import the Postman collection for instant API testing:

**[📥 Download HazeClue_API_Postman_Collection.json](https://github.com/HazeClue/Haze_clue_backend/blob/main/HazeClue_API_Postman_Collection.json)**

Set the `base_url` environment variable in Postman to:
- **Development:** `http://localhost:3001/api`
- **Production:** `https://haze-clue-backend.vercel.app/api`
