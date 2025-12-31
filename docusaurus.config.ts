import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

/**
 *
 * @param config
 * @returns
 */
const defineConfig = (config: Config) => config

export default defineConfig({
  title: 'Bubble',
  tagline:
    '泡泡聊天开放平台',
  url: 'https://bubble.alemonjs.com',
  baseUrl: '/bubble.dev/',
  organizationName: 'lemonade-lab',
  projectName: 'bubble.dev',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/lemonade-lab/alemonjs-docs'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Bubble',
      items: [
        {
          position: 'left',
          label: '文档',
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar'
        },
        {
          to: 'blog',
          label: '更新记录',
          position: 'left'
        },
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '教程',
          items: [
            {
              label: '简介',
              to: '/docs/intro'
            }
          ]
        },
        // {
        //   title: '社区',
        //   items: [
        //     {
        //       label: '群聊',
        //       href: 'https://qm.qq.com/q/aZYMNqUQc'
        //     }
        //   ]
        // },
        {
          title: '更多',
          items: [
            {
              label: 'alemonjs',
              href: 'https://github.com/lemonade-lab/alemonjs'
            }
          ]
        }
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig,
  themes: [
    [
      require.resolve(
        '@easyops-cn/docusaurus-search-local'
      ),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        hashed: true,
        // language: ['en', 'zh'],
        language: ['zh'],
        searchResultLimits: 10,
        searchResultContextMaxLength: 50
      }
    ]
  ],
  stylesheets: [],
  plugins: [
  ]
})
