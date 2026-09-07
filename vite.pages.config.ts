import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createElement, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer, defineConfig, type Plugin } from 'vite';

const projectRoot = fileURLToPath(new URL('./', import.meta.url));
const outputDirectory = fileURLToPath(new URL('./dist-pages', import.meta.url));
const defaultSiteUrl = 'https://rogueleather.ca';
const siteUrl = (process.env.SITE_URL?.trim() || defaultSiteUrl).replace(
  /\/+$/,
  '',
);
const requestedBasePath = process.env.PAGES_BASE_PATH?.trim();
const basePath = requestedBasePath
  ? `/${requestedBasePath.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
  : '/rogue-artisan-site/';

function googleIntegrations(): Plugin {
  const measurementId = process.env.GA_MEASUREMENT_ID?.trim();
  const verificationToken = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const validMeasurementId = measurementId?.match(/^G-[A-Z0-9]+$/)?.[0];
  const validVerificationToken =
    verificationToken?.match(/^[A-Za-z0-9_-]+$/)?.[0];

  return {
    name: 'rogue-google-integrations',
    apply: 'build',
    transformIndexHtml(html) {
      const tags = [];

      if (validVerificationToken) {
        tags.push({
          tag: 'meta',
          attrs: {
            name: 'google-site-verification',
            content: validVerificationToken,
          },
          injectTo: 'head' as const,
        });
      }

      if (validMeasurementId) {
        tags.push(
          {
            tag: 'script',
            attrs: {
              async: true,
              src: `https://www.googletagmanager.com/gtag/js?id=${validMeasurementId}`,
            },
            injectTo: 'head' as const,
          },
          {
            tag: 'script',
            children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${validMeasurementId}');`,
            injectTo: 'head' as const,
          },
        );
      }

      return {
        html: html.replaceAll(defaultSiteUrl, siteUrl),
        tags,
      };
    },
  };
}

function xmlEscape(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[character] ?? character,
  );
}

function prerenderAndWriteDiscoveryFiles(): Plugin {
  return {
    name: 'rogue-prerender-and-discovery-files',
    apply: 'build',
    async closeBundle() {
      const server = await createServer({
        configFile: false,
        root: projectRoot,
        base: basePath,
        appType: 'custom',
        server: { middlewareMode: true },
        plugins: [react()],
        resolve: { alias: { '@': projectRoot } },
      });

      try {
        const homeModule = (await server.ssrLoadModule(
          '/components/premium-home.tsx',
        )) as { PremiumHome: ComponentType };
        const commissionModule = (await server.ssrLoadModule(
          '/components/commission-page-content.tsx',
        )) as { CommissionPageContent: ComponentType<{ initialType: string }> };

        const pages = [
          {
            file: `${outputDirectory}/index.html`,
            markup: renderToString(createElement(homeModule.PremiumHome)),
          },
          {
            file: `${outputDirectory}/commission/index.html`,
            markup: renderToString(
              createElement(commissionModule.CommissionPageContent, {
                initialType: 'guided',
              }),
            ),
          },
        ];

        await Promise.all(
          pages.map(async ({ file, markup }) => {
            const html = await readFile(file, 'utf8');
            await writeFile(
              file,
              html.replace(
                '<div id="root"></div>',
                `<div id="root">${markup}</div>`,
              ),
              'utf8',
            );
          }),
        );
      } finally {
        await server.close();
      }

      const imageEntries = Array.from({ length: 25 }, (_, index) => {
        const number = String(index + 1).padStart(2, '0');
        return `    <image:image><image:loc>${xmlEscape(`${siteUrl}/media/lrgallery/moss-${number}.webp`)}</image:loc></image:image>`;
      }).join('\n');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${xmlEscape(`${siteUrl}/`)}</loc>
${imageEntries}
  </url>
  <url>
    <loc>${xmlEscape(`${siteUrl}/commission/`)}</loc>
  </url>
</urlset>
`;
      const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

      await Promise.all([
        writeFile(`${outputDirectory}/sitemap.xml`, sitemap, 'utf8'),
        writeFile(`${outputDirectory}/robots.txt`, robots, 'utf8'),
      ]);
    },
  };
}

export default defineConfig({
  root: fileURLToPath(new URL('./static-site', import.meta.url)),
  base: basePath,
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react(), googleIntegrations(), prerenderAndWriteDiscoveryFiles()],
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
  build: {
    outDir: outputDirectory,
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: fileURLToPath(
          new URL('./static-site/index.html', import.meta.url),
        ),
        commission: fileURLToPath(
          new URL('./static-site/commission/index.html', import.meta.url),
        ),
      },
    },
  },
});
