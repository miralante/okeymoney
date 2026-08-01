#!/usr/bin/env node
/* ============================================================
   Okeymoney — scripts/check.js
   Structural check with no dependencies (plain Node only).
   Usage: node scripts/check.js
   Checks:
   1. That every .js file at the repo root, in assets/js/, legal/ and
      scripts/ parses (equivalent to `node --check`).
   2. es/en key parity between strings.es.js and strings.en.js
      (root app and legal/).
   3. sw.js <-> disk parity: every ARCHIVOS path exists.
   4. manifest.json icons exist on disk.
   Output: list of failures with the exact file. Exit code 1 if there
   are any, "OK (N checks)" otherwise.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var execFileSync = require('child_process').execFileSync;

var ROOT = path.join(__dirname, '..');
var failures = [];
var checks = 0;

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

function listJs(dir) {
  var out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(current) {
    var entries = fs.readdirSync(current, { withFileTypes: true });
    entries.forEach(function (entry) {
      var full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        out.push(full);
      }
    });
  })(dir);
  return out;
}

/* --- 1. node --check on the root app, assets/js/, legal/ and scripts/ --- */
var jsFiles = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(function (e) { return e.isFile() && e.name.endsWith('.js'); })
  .map(function (e) { return path.join(ROOT, e.name); })
  .concat(listJs(path.join(ROOT, 'assets', 'js')))
  .concat(listJs(path.join(ROOT, 'legal')))
  .concat(listJs(path.join(ROOT, 'scripts')));

jsFiles.forEach(function (file) {
  checks += 1;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failures.push(rel(file) + ': does not parse (node --check) — ' +
      (e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message));
  }
});

/* --- 2. es/en key parity --- */
function extractDictFromStrings(file) {
  var captured = null;
  var sandbox = { App: { i18n: { register: function (dict, loc) {
    if (typeof loc === 'string') captured = dict;
  } } }, window: {} };
  sandbox.window = sandbox;
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  } catch (e) {
    return null;
  }
  return captured;
}

function flattenKeys(obj, prefix) {
  var out = [];
  Object.keys(obj || {}).forEach(function (k) {
    var key = prefix ? prefix + '.' + k : k;
    var value = obj[k];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out = out.concat(flattenKeys(value, key));
    } else {
      out.push(key);
    }
  });
  return out;
}

function compareEsEn(dir, label) {
  var fileEs = path.join(dir, 'strings.es.js');
  var fileEn = path.join(dir, 'strings.en.js');
  if (!fs.existsSync(fileEs) || !fs.existsSync(fileEn)) return;
  checks += 1;
  var dictEs = extractDictFromStrings(fileEs);
  var dictEn = extractDictFromStrings(fileEn);
  if (!dictEs || !dictEn) {
    failures.push(label + ': could not extract the es/en dicts');
    return;
  }
  var keysEs = flattenKeys(dictEs, '').sort();
  var keysEn = flattenKeys(dictEn, '').sort();
  var onlyEs = keysEs.filter(function (k) { return keysEn.indexOf(k) === -1; });
  var onlyEn = keysEn.filter(function (k) { return keysEs.indexOf(k) === -1; });
  if (onlyEs.length || onlyEn.length) {
    var detail = [];
    if (onlyEs.length) detail.push('only in es: ' + onlyEs.join(', '));
    if (onlyEn.length) detail.push('only in en: ' + onlyEn.join(', '));
    failures.push(label + ': ' + detail.join('; '));
  }
}

compareEsEn(ROOT, 'strings.<locale>.js');
compareEsEn(path.join(ROOT, 'legal'), 'legal/');

/* --- 3. sw.js <-> disk parity --- */
checks += 1;
var swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
var archivosMatch = swContent.match(/var ARCHIVOS = \[([\s\S]*?)\];/);
if (!archivosMatch) {
  failures.push('sw.js: ARCHIVOS array not found');
} else {
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(archivosMatch[1])) !== null) {
    var full = path.join(ROOT, m[1].replace(/^\.\//, ''));
    if (!fs.existsSync(full)) {
      failures.push('sw.js: ARCHIVOS lists ' + m[1] + ' but it does not exist on disk');
    }
  }
}

/* --- 4. manifest.json icons exist --- */
checks += 1;
var manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
(manifest.icons || []).forEach(function (icon) {
  var full = path.join(ROOT, icon.src.replace(/^\.\//, ''));
  if (!fs.existsSync(full)) {
    failures.push('manifest.json: icon ' + icon.src + ' does not exist on disk');
  }
});

/* --- Result --- */
if (failures.length) {
  console.log('FAILURES (' + failures.length + '):');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
