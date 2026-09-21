import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local dev server bridge for /api and SEO routes
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Polyfill helper response methods for serverless compatibility
        if (!res.status) {
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
        }
        if (!res.json) {
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
        }
        if (!res.send) {
          res.send = (data) => {
            res.end(data);
            return res;
          };
        }

        if (req.url === '/sitemap.xml') {
          const mod = await server.ssrLoadModule('./api/sitemap.js');
          return mod.default(req, res);
        }
        if (req.url === '/robots.txt') {
          const mod = await server.ssrLoadModule('./api/robots.js');
          return mod.default(req, res);
        }
        if (req.url === '/llms.txt') {
          const mod = await server.ssrLoadModule('./api/llms.js');
          return mod.default(req, res);
        }

        if (!req.url?.startsWith('/api/')) return next();

        const cleanUrl = req.url.split('?')[0].replace(/^\/api\//, '');
        let filePath = `./api/${cleanUrl}.js`;
        let queryParams = {};

        // Parse query string if present
        if (req.url.includes('?')) {
          const qs = req.url.split('?')[1];
          const sp = new URLSearchParams(qs);
          for (const [k, v] of sp.entries()) {
            queryParams[k] = v;
          }
        }

        // Match dynamic routes for local dev:
        // /api/reviews/:id/reply -> ./api/reviews/[id]/reply.js
        const replyMatch = cleanUrl.match(/^reviews\/([^/]+)\/reply$/);
        if (replyMatch) {
          filePath = './api/reviews/[id]/reply.js';
          queryParams.id = replyMatch[1];
        }

        // /api/reviews/:id -> ./api/reviews/[id]/index.js
        const reviewItemMatch = cleanUrl.match(/^reviews\/([^/]+)$/);
        if (reviewItemMatch) {
          filePath = './api/reviews/[id]/index.js';
          queryParams.id = reviewItemMatch[1];
        }

        // /api/reviews -> ./api/reviews/index.js
        if (cleanUrl === 'reviews') {
          filePath = './api/reviews/index.js';
        }

        req.query = { ...queryParams, ...(req.query || {}) };

        let rawBody = '';
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', async () => {
          if (rawBody) {
            try { req.body = JSON.parse(rawBody); } catch { req.body = {}; }
          }
          try {
            const module = await server.ssrLoadModule(filePath);
            const handler = module.default;
            if (handler) {
              return handler(req, res);
            }
          } catch (err) {
            console.error(`[Local API Error on ${req.url} -> ${filePath}]:`, err?.message || err);
          }
          next();
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevMiddleware()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'R2_'],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
