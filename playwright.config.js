/*
 * playwright.config.js — the Playwright run of Okeymoney.
 *
 * The suite of specs (tests/*.spec.js) is `npm run test:ui`; the crawler that
 * walks the app with Chromium keeps its own name, `npm run test:crawl`.
 *
 * The port is 4177 by default (PORT wins) so two apps of the suite can run
 * at the same time without fighting for the port.
 *
 * The Playwright API is loaded through tests/playwright.js, the shim of the
 * suite: the specs and the runner must use the SAME copy of Playwright, or
 * the runner refuses to load them.
 */
'use strict';

const { defineConfig } = require('./tests/playwright.js');

const PORT = Number(process.env.PORT || 4177);

module.exports = defineConfig({
  testDir: './tests',
  // The specs of the suite share the same browser profile of the app: they
  // read and write localStorage, so they run one after the other.
  fullyParallel: false,
  workers: 1,
  reporter: 'line',
  timeout: 120000,
  retries: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}/`,
    headless: true,
  },
  webServer: {
    command: `node scripts/serve.js ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
});
