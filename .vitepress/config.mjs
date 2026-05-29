import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    title: "HazeClue Docs",
    description: "Official documentation for the HazeClue platform.",
    appearance: 'dark', // Force dark mode for identity
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Overview', link: '/docs/overview' },
      ],

      sidebar: [
        {
          text: 'Introduction',
          items: [
            { text: 'System Overview', link: '/docs/overview' },
            { text: 'User Stories & Requirements', link: '/docs/user-stories/' },
            { text: 'Presentation & Pitch', link: '/docs/presentation/' }
          ]
        },
        {
          text: 'Applications',
          items: [
            { text: 'Mobile App (Flutter)', link: '/docs/mobile/' },
            { text: 'Landing Website', link: '/docs/website/' }
          ]
        },
        {
          text: 'Backend & APIs',
          items: [
            { text: 'Mobile Backend (.NET)', link: '/docs/backend-mobile/' },
            { text: 'Web Backend', link: '/docs/backend-web/' }
          ]
        },
        {
          text: 'Artificial Intelligence',
          items: [
            { text: 'AI Models & Pipelines', link: '/docs/ai/' }
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/hazeclue' }
      ]
    }
  })
);
