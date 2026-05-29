import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: "HazeClue",
    titleTemplate: ":title — HazeClue Docs",
    description: "Official developer documentation for the HazeClue platform — EEG-driven cognitive enhancement through AI, BCI hardware, and real-time telemetry.",
    appearance: 'dark',

    head: [
      ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
      ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
      ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap', rel: 'stylesheet' }],
      ['meta', { name: 'theme-color', content: '#8B5CF6' }],
      ['meta', { name: 'og:type', content: 'website' }],
      ['meta', { name: 'og:locale', content: 'en' }],
      ['meta', { name: 'og:site_name', content: 'HazeClue Docs' }],
    ],

    themeConfig: {
      logo: { light: '/logo.svg', dark: '/logo.svg', alt: 'HazeClue' },
      siteTitle: 'HazeClue',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Overview', link: '/docs/overview' },
        {
          text: 'Backends & APIs',
          items: [
            { text: 'Web Backend (NestJS)', link: '/docs/backend-web/' },
            { text: 'Mobile Backend (.NET)', link: '/docs/backend-mobile/' },
          ]
        },
        {
          text: 'Clients',
          items: [
            { text: 'Flutter Mobile App', link: '/docs/mobile/' },
            { text: 'Instructor Web Platform', link: '/docs/website/' },
          ]
        },
        { text: 'AI Engine', link: '/docs/ai/' },
        {
          text: 'Links',
          items: [
            { text: '🚀 Live Platform', link: 'https://hazeclue.netlify.app' },
            { text: '📊 Presentation', link: 'https://hazeclue-presntaion.netlify.app/1' },
            { text: '🐙 GitHub Org', link: 'https://github.com/HazeClue' },
          ]
        }
      ],

      sidebar: [
        {
          text: '🧠 Getting Started',
          collapsed: false,
          items: [
            { text: 'System Overview', link: '/docs/overview' },
            { text: 'User Stories & Epics', link: '/docs/user-stories/' },
            { text: 'Presentation & Pitch', link: '/docs/presentation/' }
          ]
        },
        {
          text: '⚡ Web Backend — NestJS',
          collapsed: false,
          items: [
            { text: 'Introduction & Stack', link: '/docs/backend-web/' },
            { text: 'Authentication', link: '/docs/backend-web/authentication' },
            { text: 'Sessions API', link: '/docs/backend-web/sessions' },
            { text: 'Devices API', link: '/docs/backend-web/devices' },
            { text: 'Reports & Dashboard', link: '/docs/backend-web/reports' },
            { text: 'Real-Time (Pusher)', link: '/docs/backend-web/realtime' },
            { text: 'Deployment & Env', link: '/docs/backend-web/deployment' },
          ]
        },
        {
          text: '📱 Mobile Backend — .NET',
          collapsed: true,
          items: [
            { text: 'Introduction & Stack', link: '/docs/backend-mobile/' },
          ]
        },
        {
          text: '📲 Flutter Mobile App',
          collapsed: true,
          items: [
            { text: 'App Overview', link: '/docs/mobile/' },
          ]
        },
        {
          text: '🌐 Instructor Web Platform',
          collapsed: true,
          items: [
            { text: 'Nuxt 4 Frontend', link: '/docs/website/' },
          ]
        },
        {
          text: '🤖 AI Engine',
          collapsed: true,
          items: [
            { text: 'RARD–MVES Engine', link: '/docs/ai/' },
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/HazeClue' },
      ],

      footer: {
        message: 'Built with ❤️ by the HazeClue Team',
        copyright: '© 2026 HazeClue. Graduation Project — All rights reserved.'
      },

      editLink: {
        pattern: 'https://github.com/HazeClue/Haze_clue_backend/edit/main/docs/:path',
        text: 'Suggest improvements on GitHub'
      },

      search: {
        provider: 'local',
        options: {
          detailedView: true,
        }
      },

      lastUpdated: {
        text: 'Last updated',
        formatOptions: {
          dateStyle: 'full',
        }
      },

      outline: {
        level: [2, 3],
        label: 'On this page'
      },
    },

    mermaid: {
      theme: 'dark',
    },
  })
);
