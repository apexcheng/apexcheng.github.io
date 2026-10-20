import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

// A deterministic deployment gate: checks generated internal links only.
// External websites (including separately hosted Pages apps) are not local build outputs.
const dist = resolve('dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('Missing dist/index.html; run the Astro build first.');
  process.exit(1);
}

function htmlFiles(folder) {
  return readdirSync(folder).flatMap((name) => {
    const file = join(folder, name);
    return statSync(file).isDirectory() ? htmlFiles(file) : name.endsWith('.html') ? [file] : [];
  });
}

function builtTarget(path) {
  const decoded = decodeURIComponent(path);
  const local = resolve(dist, '.' + (decoded.startsWith('/') ? decoded : '/' + decoded));
  if (!local.startsWith(dist + sep) && local !== dist) return false;
  return [local, join(local, 'index.html'), local + '.html'].some((candidate) =>
    existsSync(candidate) && statSync(candidate).isFile(),
  );
}

const errors = [];
const origin = 'https://apexcheng.github.io';
for (const file of htmlFiles(dist)) {
  const html = readFileSync(file, 'utf8');
  const path = '/' + file.slice(dist.length + 1).replace(/(^|\/)index\.html$/, '$1').replaceAll(sep, '/');
  for (const [, raw] of html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const href = raw.replaceAll('&amp;', '&');
    if (!href || href.startsWith('#') || href.startsWith('//')) continue;
    // Don't hard-block on network links: same-host /gallery/ is a separate Pages app.
    if (/^[a-z][a-z\d+.-]*:/i.test(href)) continue;
    try {
      const url = new URL(href, origin + path);
      if (url.origin !== origin || !builtTarget(url.pathname)) errors.push(`${path} → ${href}`);
    } catch {
      errors.push(`${path} → ${href} (invalid URL)`);
    }
  }
}

const sitemapPath = join(dist, 'sitemap.xml');
const robotsPath = join(dist, 'robots.txt');
if (!existsSync(sitemapPath) || !existsSync(robotsPath)) {
  errors.push('Missing generated sitemap.xml or robots.txt');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://apexcheng.github.io/sitemap.xml')) errors.push('robots.txt sitemap reference is missing');
  for (const [, raw] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      const url = new URL(raw.replaceAll('&amp;', '&'));
      if (url.origin !== origin || !builtTarget(url.pathname)) errors.push(`sitemap → ${raw}`);
    } catch {
      errors.push(`Invalid sitemap URL: ${raw}`);
    }
  }
  for (const forbidden of ['/context-flow-demo/', '/intro-motion-3/', '/home-redesign-1/']) {
    if (xml.includes(origin + forbidden)) errors.push(`Experimental path in sitemap: ${forbidden}`);
  }
}

if (errors.length) {
  console.error(`Build link check failed with ${errors.length} issue(s):\n` + errors.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log(`Build link check passed: ${htmlFiles(dist).length} HTML files; all local links and sitemap entries resolve.`);
