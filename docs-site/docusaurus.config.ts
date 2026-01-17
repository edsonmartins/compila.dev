import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'compila.dev Docs',
  tagline: 'Guia tecnico e produto',
  url: 'https://compila.dev',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'compila-dev',
  projectName: 'compila.dev',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themeConfig: {
    navbar: {
      title: 'compila.dev',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'main',
          position: 'left',
          label: 'Documentacao',
        },
        {
          href: 'https://compila.dev',
          label: 'Site',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Visao geral', to: '/' },
            { label: 'Arquitetura', to: '/architecture' },
            { label: 'Backend', to: '/backend' },
          ],
        },
        {
          title: 'Produto',
          items: [
            { label: 'Frontend', to: '/frontend' },
            { label: 'AI Service', to: '/ai-service' },
            { label: 'Roadmap', to: '/roadmap' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} compila.dev`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
