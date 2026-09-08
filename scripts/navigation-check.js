#!/usr/bin/env node
/* Okeymoney — navigation smoke test
 * Usage:
 *   node scripts/navigation-check.js
 *   node scripts/navigation-check.js https://example.com/
 */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var BASE = (process.argv[2] || 'https://okeymoney.apptonomia.uk/').replace(/\/+$/, '') + '/';
var failures = [];

function addRoute(routes, route) {
  if (routes.indexOf(route) === -1) routes.push(route);
}

var routes = ['/', '/site/', '/config/', '/legal/index.html'];
var data = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
var hrefPattern = /href:\s*'([^']+)'/g;
var match;
while ((match = hrefPattern.exec(data)) !== null) {
  if (/^tools\//.test(match[1])) addRoute(routes, '/' + match[1]);
}

async function check(route) {
  var url = new URL(route.replace(/^\//, ''), BASE).href;
  try {
    var response = await fetch(url, { redirect: 'follow' });
    var contentType = response.headers.get('content-type') || '';
    var body = await response.text();
    if (!response.ok) {
      failures.push(route + ' — HTTP ' + response.status);
    } else if (!/text\/html/i.test(contentType) || !/<html[\s>]/i.test(body)) {
      failures.push(route + ' — no devuelve HTML válido');
    } else if (/<title>[^<]*(404|not found|no se puede acceder)/i.test(body)) {
      failures.push(route + ' — parece una página de error');
    } else {
      console.log('OK  ' + route + ' -> ' + response.url);
    }
  } catch (error) {
    failures.push(route + ' — ' + error.message);
  }
}

(async function () {
  console.log('Comprobando navegación en ' + BASE);
  for (var i = 0; i < routes.length; i++) await check(routes[i]);
  console.log('\nRutas comprobadas: ' + routes.length);
  if (failures.length) {
    console.error('Fallos:');
    failures.forEach(function (failure) { console.error('FAIL ' + failure); });
    process.exitCode = 1;
  } else {
    console.log('Navegación OK');
  }
})();
