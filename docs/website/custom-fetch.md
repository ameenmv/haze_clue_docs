# $customFetch Plugin — Nuxt 4

**File:** `app/plugins/customFetch.ts`

The `$customFetch` plugin is the **centralized HTTP client** for the Nuxt instructor platform. It wraps Nuxt's `$fetch` with automatic auth headers, i18n language headers, request deduplication (AbortController), and unified error handling.

## Why a Custom Plugin?

Nuxt's built-in `$fetch` doesn't know about auth tokens or locale preferences. Rather than manually adding headers in every `useAsyncData` or composable, `$customFetch` provides a pre-configured instance that all pages use identically.

## Full Implementation

```typescript
// app/plugins/customFetch.ts

// Per-URL AbortController registry (deduplication)
const abortControllers: Record<string, AbortController> = {}

export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = useNuxtApp()
  const { locale } = $i18n as { locale: Ref<string> }
  const config = useRuntimeConfig()

  // All requests go through Nuxt's /api proxy route
  // → routeRules proxies /api/** to the real NestJS backend
  // → Eliminates CORS issues (browser talks to same-origin only)
  const baseURL = '/api'

  const customFetch = $fetch.create({
    baseURL,
    headers: {
      'Accept': 'application/json',
      'Accept-Language': locale.value || 'en',
      'lang': locale.value || 'en',
    },

    onRequest({ request, options }) {
      // ── Request Deduplication ──────────────────────────────
      // If the same URL is requested again before the first completes,
      // abort the previous request to prevent stale data race conditions
      if (typeof request === 'string') {
        if (abortControllers[request]) {
          abortControllers[request].abort()
        }
        const controller = new AbortController()
        abortControllers[request] = controller
        options.signal = controller.signal
      }

      // ── Auth Header Injection ──────────────────────────────
      const token = useCookie('auth_token').value
      if (token) options.headers.set('Authorization', `Bearer ${token}`)
    },

    onRequestError({ error }) {
      if (error?.name === 'AbortError') return  // Ignore intentional aborts
      // Show toast or throw Nuxt error depending on context
    },

    onResponse({ response }) {
      return response._data  // Unwrap response body
    },

    async onResponseError({ response }) {
      const status = response.status

      if (import.meta.client) {
        if (status === 401) {
          // Token expired or invalid → clear and redirect
          useAuthStore().clearSession(false)
          await navigateTo('/login')
        } else if (status === 403) {
          useToast().add({ title: 'Access Denied', color: 'error' })
        } else {
          // Show error message from backend
          const errorMessage = response._data?.message
            || response._data?.error
            || 'Something went wrong'
          useToast().add({ title: errorMessage, color: 'error' })
          throw response._data
        }
      } else {
        // Server-side: throw Nuxt error with status code
        throw createError({
          statusCode: status,
          statusMessage: response._data?.message || 'API error'
        })
      }
    }
  })

  return { provide: { customFetch } }
})
```

## Key Features

### 1. Proxy-Based API Routing

```typescript
// nuxt.config.ts
routeRules: {
  '/api/**': {
    proxy: `${process.env.NUXT_PUBLIC_API_BASE_URL}/**`
  }
}
```

All API calls go to `/api/...` (same-origin). Nuxt proxies them server-side to the NestJS backend. This **eliminates all CORS issues** — the browser never directly contacts the backend.

### 2. Auth Token Auto-Injection

```typescript
const token = useCookie('auth_token').value
if (token) options.headers.set('Authorization', `Bearer ${token}`)
```

The token is read from the `auth_token` cookie on every request — no manual header management needed in pages.

### 3. Request Deduplication

```typescript
if (abortControllers[request]) {
  abortControllers[request].abort()  // Cancel previous request for same URL
}
const controller = new AbortController()
abortControllers[request] = controller
```

If the user navigates quickly or multiple components request the same endpoint simultaneously, previous requests are automatically cancelled. Prevents race conditions and waterfall stale-data bugs.

### 4. Auto-401 Redirect

```typescript
if (status === 401) {
  useAuthStore().clearSession(false)
  await navigateTo('/login')
}
```

Any API returning 401 (expired/invalid token) automatically clears the session and redirects to login — no try/catch needed in page code.

### 5. i18n Language Headers

```typescript
'Accept-Language': locale.value || 'en',
'lang': locale.value || 'en',
```

The current locale (Arabic or English) is sent with every request, allowing the backend to respond in the user's language.

## Usage in Pages

```vue
<script setup lang="ts">
const { $customFetch } = useNuxtApp()

// In useAsyncData (SSR-safe)
const { data: sessions } = await useAsyncData('sessions', () =>
  $customFetch('/sessions')
)

// In event handlers (client-only)
async function createSession(payload) {
  const session = await $customFetch('/sessions', {
    method: 'POST',
    body: payload
  })
  await navigateTo(`/dashboard/sessions/${session._id}`)
}
</script>
```

## User Plugin (`app/plugins/user.ts`)

A companion plugin that loads the current user profile on app start:

```typescript
// app/plugins/user.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    // Hydrate user data from backend
    const { $customFetch } = useNuxtApp()
    const user = await $customFetch('/users/me')
    authStore.setUser(user)
  }
})
```
