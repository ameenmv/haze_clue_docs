# Pages & Routing — Nuxt 4

The instructor platform uses **Nuxt 4 file-based routing** (`app/pages/`) with an `auth` middleware protecting all dashboard routes.

## Route Map

```
/                    → app/pages/index.vue          (redirect to /login or /dashboard)
/login               → app/pages/login.vue
/register            → app/pages/register.vue
/forgot-password     → app/pages/forgot-password.vue
/verify              → app/pages/verify.vue
/reset-password      → app/pages/reset-password.vue

/dashboard           → app/pages/dashboard/index.vue         🔒
/dashboard/devices   → app/pages/dashboard/devices.vue       🔒
/dashboard/profile   → app/pages/dashboard/profile.vue       🔒
/dashboard/reports   → app/pages/dashboard/reports.vue       🔒
/dashboard/sessions  → app/pages/dashboard/sessions/         🔒
/dashboard/settings  → app/pages/dashboard/settings.vue      🔒
/dashboard/help      → app/pages/dashboard/help.vue          🔒
/dashboard/live-session    → app/pages/dashboard/live-session.vue    🔒
/dashboard/live-monitoring → app/pages/dashboard/live-monitoring.vue 🔒
```

## Directory Structure

```
app/
├── pages/
│   ├── index.vue                    # Root redirect
│   ├── login.vue
│   ├── register.vue
│   ├── forgot-password.vue
│   ├── verify.vue
│   ├── reset-password.vue
│   └── dashboard/
│       ├── index.vue                # Dashboard home with stats
│       ├── devices.vue              # Device management
│       ├── profile.vue              # Instructor profile
│       ├── reports.vue              # Post-session reports list
│       ├── settings.vue             # Account settings
│       ├── help.vue                 # Help & support
│       ├── live-session.vue         # Live EEG monitoring (Pusher)
│       ├── live-monitoring.vue      # Read-only monitoring view
│       └── sessions/                # Session sub-routes
│
├── layouts/
│   ├── default.vue                  # Auth pages layout
│   └── dashboard.vue                # Dashboard layout with sidebar
│
├── middleware/
│   └── auth.ts                      # JWT guard for 🔒 routes
│
├── stores/
│   └── auth.ts                      # Pinia auth store
│
├── plugins/
│   ├── customFetch.ts               # HTTP client
│   └── user.ts                      # Profile hydration
│
├── components/                      # Shared Vue components
├── composables/                     # Vue composables
├── services/                        # API service functions
├── types/                           # TypeScript types (auto-imported)
├── utils/                           # Utility functions
└── schema/                          # Zod validation schemas
```

## Key Pages

### `/dashboard` — Home

Displays KPI stats via `GET /api/sessions?limit=5` and `GET /api/dashboard/stats`:

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { $customFetch } = useNuxtApp()

const { data: stats } = await useAsyncData('dashboard-stats', () =>
  $customFetch('/dashboard/stats')
)
const { data: recentSessions } = await useAsyncData('recent-sessions', () =>
  $customFetch('/sessions?limit=5')
)
</script>
```

### `/dashboard/devices` — Devices

Full device management UI:
- List all registered EEG/BCI devices
- Register new device (name, serial number)
- Delete device

```typescript
// devices.vue
await $customFetch('/devices', { method: 'POST', body: { name, serialNumber } })
```

### `/dashboard/reports` — Reports

Post-session analytics with Chart.js heatmaps and attention timelines:

```typescript
const { data: reports } = await useAsyncData('reports', () =>
  $customFetch('/reports')
)
```

Export buttons:
```typescript
// PDF download
window.open(`/api/sessions/${sessionId}/export/pdf`, '_blank')

// CSV download
window.open(`/api/sessions/${sessionId}/export/csv`, '_blank')
```

### `/dashboard/profile` — Profile

Instructor profile management:
```typescript
await $customFetch('/users/me', {
  method: 'PATCH',
  body: { fullName, phoneNumber }
})
```

## Middleware Guard

```typescript
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthStore()
  if (!isLoggedIn) {
    return navigateTo('/login')
  }
})
```

Applied to all dashboard pages:
```vue
<script setup>
definePageMeta({ middleware: 'auth' })
</script>
```

## i18n Routing

The app supports Arabic and English via `@nuxtjs/i18n`:

```typescript
// nuxt.config.ts
i18n: {
  strategy: 'no_prefix',   // No /ar/ or /en/ prefix in URLs
  defaultLocale: 'en',
  locales: [
    { code: 'en', dir: 'ltr', file: 'en.ts' },
    { code: 'ar', dir: 'rtl', file: 'ar.ts' }
  ],
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_locale',
    alwaysRedirect: true,
  }
}
```

Arabic locale enables RTL layout automatically via `dir: 'rtl'`.

## Fonts

```typescript
// nuxt.config.ts
fonts: {
  families: [
    { name: 'Plus Jakarta Sans', weights: [200, 300, 400, 500, 600, 700, 800] }, // English
    { name: 'Tajawal', weights: [200, 300, 400, 500, 700, 800, 900] },           // Arabic
    { name: 'Poppins', weights: [300, 400, 500, 600, 700] },
    { name: 'Inter', weights: [300, 400, 500, 600, 700] }
  ]
}
```
