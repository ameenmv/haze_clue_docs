# Build & Deployment — Nuxt 4

> **Production URL:** [hazeclue.netlify.app](https://hazeclue.netlify.app)  
> **Deployed on:** Netlify (SSR via Netlify Functions)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Nuxt 4 (Vue 3) |
| **Rendering** | SSR (Server-Side Rendering) |
| **State** | Pinia |
| **HTTP Client** | `$customFetch` (Nuxt `$fetch` wrapper) |
| **Real-Time** | `pusher-js` |
| **Charts** | `chart.js` + `vue-chartjs` |
| **UI Components** | `@nuxt/ui` (Reka UI based) |
| **i18n** | `@nuxtjs/i18n` (ar + en, RTL/LTR) |
| **Animations** | `nuxt-aos` (scroll-based), `gsap` (landing page) |
| **Validation** | `zod` |
| **Fonts** | `@nuxt/fonts` (Plus Jakarta Sans, Tajawal, Inter) |
| **Package Manager** | `bun` |
| **Deployment** | Netlify |

## Environment Variables

Create a `.env` at the project root:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NUXT_PUBLIC_API_BASE_URL` | ✅ | NestJS backend base URL | 
| `NUXT_PUBLIC_APP_NAME` | ❌ | App display name |
| `NUXT_PUBLIC_PUSHER_KEY` | ✅ | Pusher public key (`aa0fca879ef3879464ff`) |
| `NUXT_PUBLIC_PUSHER_CLUSTER` | ✅ | Pusher cluster (`eu`) |

**Example `.env`:**
```
NUXT_PUBLIC_API_BASE_URL=https://haze-clue-backend.vercel.app/api
NUXT_PUBLIC_APP_NAME=HazeClue
NUXT_PUBLIC_PUSHER_KEY=aa0fca879ef3879464ff
NUXT_PUBLIC_PUSHER_CLUSTER=eu
```

## Local Development Setup

```bash
# Clone
git clone https://github.com/HazeClue/Haze_clue_website.git
cd Haze_clue_website

# Install dependencies
bun install

# Start dev server
bun run dev
# → http://localhost:3000
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with HMR |
| `bun run build` | Build SSR production bundle |
| `bun run preview` | Preview production build locally |
| `bun run generate` | Generate static site (SSG mode) |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | TypeScript type checking |

## Build Optimization (Vite)

The production bundle uses **manual chunk splitting** to maximize browser cache efficiency. Each vendor library gets its own cached bundle:

```typescript
// nuxt.config.ts
vite: {
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 350,
    sourcemap: false,  // Disabled in production (faster build)
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('vue-i18n') || id.includes('@intlify')) return 'vendor-i18n'
          if (id.includes('chart.js') || id.includes('vue-chartjs'))  return 'vendor-charts'
          if (id.includes('gsap'))                                     return 'vendor-gsap'
          if (id.includes('reka-ui'))                                  return 'vendor-reka-ui'
          if (id.includes('@vueuse'))                                  return 'vendor-vueuse'
          if (id.includes('@floating-ui'))                             return 'vendor-floating-ui'
          if (id.includes('pinia') || id.includes('@pinia'))           return 'vendor-pinia'
          if (id.includes('/zod/'))                                    return 'vendor-zod'
          if (id.includes('aos') && id.includes('node_modules'))      return 'vendor-aos'
          if (id.includes('@iconify'))                                 return 'vendor-icons'
        }
      }
    }
  }
}
```

**Result:** First-time visitors download all chunks. Return visitors only download chunks that changed — dramatically improving perceived performance.

## Nitro Server

```typescript
nitro: {
  minify: true  // Minify server-side JS output
}
```

## API Proxy (Avoiding CORS)

The Nuxt server acts as a reverse proxy to the NestJS backend:

```typescript
// nuxt.config.ts
routeRules: {
  '/api/**': {
    proxy: `${process.env.NUXT_PUBLIC_API_BASE_URL}/**`
  }
}
```

- **Browser** → `/api/sessions` (same origin, no CORS)
- **Nuxt Server** → `https://haze-clue-backend.vercel.app/api/sessions`

## Netlify Deployment

```bash
# Build command
bun run build

# Publish directory
.output/public

# Functions directory (for SSR)
.output/server
```

The Netlify deploy uses the **Nuxt Nitro** SSR server running as Netlify Functions — full SSR with no cold-start penalty on pre-warmed functions.

**`_redirects` file** (in `/public`):
```
/* /.netlify/functions/server 200
```

## PM2 Production Mode

For self-hosted VPS deployment using PM2:

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: 'hazeclue-web',
    script: '.output/server/index.mjs',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
