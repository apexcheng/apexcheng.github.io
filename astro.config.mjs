import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

// Shiki does not bundle an Excel formula grammar. Keep highlighting focused on formula syntax.
const excelFormula = {
  name: 'excel',
  scopeName: 'source.excel',
  patterns: [
    { name: 'string.quoted.double.excel', match: '"(?:[^"]|"")*"' },
    { name: 'support.function.excel', match: '\\b[A-Za-z_][A-Za-z_0-9.]*\\b(?=\\s*\\()' },
    { name: 'constant.language.boolean.excel', match: '\\b(?:TRUE|FALSE)\\b' },
    { name: 'variable.parameter.cell.excel', match: '(?<![\\w.])\\$?[A-Za-z]{1,3}\\$?[1-9][0-9]*#?(?![\\w])' },
    { name: 'variable.parameter.range.excel', match: '(?<![\\w.])\\$?[A-Za-z]{1,3}:\\$?[A-Za-z]{1,3}(?![\\w])' },
    { name: 'constant.numeric.excel', match: '(?<![\\w.])\\d+(?:\\.\\d+)?\\b' },
    { name: 'keyword.operator.excel', match: '<>|<=|>=|[+*/^&=<>!:#%-]' },
  ],
};

export default defineConfig({
  site: 'https://apexcheng.github.io',
  devToolbar: {
    enabled: true,
  },
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      langs: [excelFormula],
    },
  },
});
