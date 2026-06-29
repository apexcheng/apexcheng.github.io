import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { siteMeta } from './src/data/site';

export default defineConfig({
  site: 'https://apexcheng.github.io',
  base: '/blog',
  devToolbar: {
    enabled: true,
  },
  integrations: [
    starlight({
      title: siteMeta.siteName,
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [{ icon: 'github', label: 'GitHub', href: siteMeta.githubUrl }],
      customCss: ['./src/styles/global.css'],
    }),
    mdx(),
  ],
});
