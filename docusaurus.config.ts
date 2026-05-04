import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Dropsy',
  tagline: 'The token distribution layer for Solana',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://dropsy.org/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dropsy labs', // Usually your GitHub org/user name.
  projectName: 'dropsy', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          path: 'docs',       // folder in your project
          routeBasePath: '/', // 🚀 docs appear at site root
          //versions: false,    // disable versioning
        },

        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexPages: true,
        docsRouteBasePath: '/'
      }
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Dropsy',
      logo: {
        alt: 'Dropsy Logo',
        src: 'img/logo.png',
      },

      items: [
        /*{
          to: 'https://app.dropsy.xyz',
          label: 'Launch App',
          position: 'right',
          className: 'navbar-launch-app',  // custom class for styling
        },*/
      ],
    },
    footer: {
      style: 'light',
      links: [
        /*{
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/tut',
            },
          ],
        },*/
        {
          title: 'Community',
          items: [
            {
              label: 'X (Twitter) ',
              to: 'https://x.com/dropsy_protocol',
            },
            {
              label: 'Discord',
              to: 'https://discordapp.com/invite/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              to: 'https://www.dropsy.xyz/',
            },
            {
              label: 'App',
              to: 'https://app.dropsy.xyz/',
            },
          ],
        },
      ],
      copyright: `Copyright ©2025 DROPSY`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
