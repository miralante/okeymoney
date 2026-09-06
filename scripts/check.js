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
   3. sw.js <-> disk parity: every FILES path exists.
   4. manifest.json icons exist on disk.
   5. Mandatory rule: zero mentions of disability, occupational therapy
      or minors in user-facing files (see doc/<locale>/SPEC.md §4).
   6. _headers: every quoted Content-Security-Policy source expression
      (e.g. 'self') has exactly one leading and one trailing quote —
      catches malformed quoting like ''self'' that browsers silently
      drop, turning a directive into "block everything" (this bit
      teclatlon in production; see the sibling repo's CLOUDFLARE.md).
   7. Usage vs. registration: every data-i18n / data-i18n-aria /
      data-i18n-meta / data-i18n-title attribute in a page's index.html,
      and every literal App.i18n.t('key') call reachable from that page,
      must resolve to a key actually registered (in each locale) by that
      page's own <script src> bundle. Catches a key that's referenced
      from markup/JS but misspelled or never added to any
      strings.<locale>.js: it passes checks 1-6 silently, then renders
      as the raw key text in the browser, because t() returns the key
      itself on a lookup miss (see assets/js/i18n.js t()).
   8. Content catalog integrity: every available activity points to an
      existing page, every unit has an activity, and simulations point to
      valid units and known actions.
   9. _redirects stays within Cloudflare's per-file limits
      (https://developers.cloudflare.com/pages/configuration/redirects/):
      a maximum of 2 000 static redirects and 100 dynamic
      (placeholder) redirects per file — 2 100 in total. If the file
      is absent (the common case for projects that have no redirects)
      the check is skipped: zero is valid.
  10. _headers stays within Cloudflare's per-file limit of 100
      header rules per file
      (https://developers.cloudflare.com/pages/configuration/headers/).
      A "rule" is one path-glob block (the glob line followed by
      indented header lines), so the wildcards of `/assets/*` plus
      its two Cache-Control lines count as one rule each, not three.
      If the file is absent the check is skipped.
  11. No shipped file exceeds Cloudflare Pages' 25 MB per-file
      limit. Recursively walks the repo, excluding `.git/`,
      `node_modules/`, `.claude/` (graphify skill + agent settings,
      never uploaded), and `graphify-out*` (build artifacts). Warns
      at 20 MB (still legal but worth a nudge) and fails at 25 MB
      (Cloudflare will reject the deploy).
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
var warnings = [];
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

/* --- 1. node --check on the root app, assets/js/, legal/, scripts/ and tools/ --- */
var jsFiles = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(function (e) { return e.isFile() && e.name.endsWith('.js'); })
  .map(function (e) { return path.join(ROOT, e.name); })
  .concat(listJs(path.join(ROOT, 'assets', 'js')))
  .concat(listJs(path.join(ROOT, 'legal')))
  .concat(listJs(path.join(ROOT, 'scripts')))
  .concat(listJs(path.join(ROOT, 'tools')));

jsFiles.forEach(function (file) {
  checks += 1;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failures.push(rel(file) + ': does not parse (node --check) — ' +
      (e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message));
  }
});

/* --- 2. strings.<locale>.js key parity across all supported locales --- */
/* When adding a new supported language, add its code here. The check
   verifies every file in `dir` whose name matches `strings.<locale>.js`
   has the exact same key set as every other one. */
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

function compareLocales(dir, label) {
  var entries = fs.readdirSync(dir)
    .filter(function (name) { return /^strings\.[a-zA-Z0-9-]+\.js$/.test(name); });
  if (entries.length < 2) return;
  checks += 1;
  var dicts = {};
  entries.forEach(function (name) {
    var d = extractDictFromStrings(path.join(dir, name));
    if (!d) {
      failures.push(label + ': could not extract dict from ' + name);
      return;
    }
    dicts[name] = flattenKeys(d, '').sort();
  });
  if (failures.length && failures[failures.length - 1].indexOf('could not extract') !== -1) return;
  var names = Object.keys(dicts);
  var reference = names[0];
  names.slice(1).forEach(function (name) {
    var a = dicts[reference], b = dicts[name];
    var onlyA = a.filter(function (k) { return b.indexOf(k) === -1; });
    var onlyB = b.filter(function (k) { return a.indexOf(k) === -1; });
    if (onlyA.length || onlyB.length) {
      var detail = [];
      if (onlyA.length) detail.push('only in ' + reference + ': ' + onlyA.join(', '));
      if (onlyB.length) detail.push('only in ' + name + ': ' + onlyB.join(', '));
      failures.push(label + ': ' + detail.join('; '));
    }
  });
}

compareLocales(ROOT, 'strings.<locale>.js');
compareLocales(path.join(ROOT, 'legal'), 'legal/');

/* Each tools/<slug>/ folder ships its own strings.<locale>.js pair;
   parity must hold per activity so the bilingual contract is kept
   everywhere the end user can land. */
(function checkToolsLocales() {
  var toolsDir = path.join(ROOT, 'tools');
  if (!fs.existsSync(toolsDir)) return;
  fs.readdirSync(toolsDir).forEach(function (name) {
    var full = path.join(toolsDir, name);
    if (!fs.statSync(full).isDirectory()) return;
    compareLocales(full, 'tools/' + name + '/');
  });
})();

/* --- 3. sw.js <-> disk parity --- */
checks += 1;
var swContent = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
var filesMatch = swContent.match(/var FILES = \[([\s\S]*?)\];/);
if (!filesMatch) {
  failures.push('sw.js: FILES array not found');
} else {
  var re = /'([^']+)'/g;
  var m;
  while ((m = re.exec(filesMatch[1])) !== null) {
    var full = path.join(ROOT, m[1].replace(/^\.\//, ''));
    if (!fs.existsSync(full)) {
      failures.push('sw.js: FILES lists ' + m[1] + ' but it does not exist on disk');
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

/* --- 5. Mandatory rule: zero disability / occupational therapy / minors mentions ---
   doc/<locale>/SPEC.md §4: the end user never sees terms naming
   intellectual disability, occupational therapy, minors, or equivalents.
   This scan only covers the files the end user actually reaches;
   internal docs (SPEC.md, README.md, CONTRIBUTING.md, CLAUDE.md) are
   out of scope by design (they explain the project's real objective,
   which is the very reason this rule exists).

   Each entry pairs a substring or word-boundary match mode. Spanish
   phrases and unambiguous English stems use substring; English words
   that would produce false positives as substrings (e.g. "minor"
   inside "minor annoyance") use word-boundary.
*/
checks += 1;
var FORBIDDEN_TERMS = [
  { term: 'discapacidad', match: 'substring' },
  { term: 'disabilit', match: 'substring' },
  { term: 'intelectual', match: 'substring' },
  { term: 'intellectual', match: 'substring' },
  { term: 'terapia ocupacional', match: 'substring' },
  { term: 'occupational therap', match: 'substring' },
  { term: 'dificultades cognitivas', match: 'substring' },
  { term: 'cognitive difficult', match: 'substring' },
  { term: 'necesidades especiales', match: 'substring' },
  { term: 'special needs', match: 'substring' },
  { term: 'capacidades diferentes', match: 'substring' },
  { term: 'different abilities', match: 'substring' },
  { term: 'menor de edad', match: 'substring' },
  { term: 'menores de edad', match: 'substring' },
  { term: 'personas menores', match: 'substring' },
  { term: 'menor que', match: 'substring' },
  { term: 'menores que', match: 'substring' },
  { term: 'minor', match: 'word' },
  { term: 'underage', match: 'word' },
  { term: 'children', match: 'word' },
  { term: 'paciente', match: 'word' },
  { term: 'patient', match: 'word' }
];
function isUserFile(file) {
  var name = path.basename(file).toLowerCase();
  return /\.html?$/.test(name) || /\.js$/.test(name);
}
function listFiles(dir) {
  var out = [];
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).forEach(function (f) {
    var full = path.join(dir, f);
    if (fs.statSync(full).isFile() && isUserFile(full)) out.push(full);
  });
  return out;
}
var userFacingTargets = [path.join(ROOT, 'index.html')]
  .concat(listFiles(path.join(ROOT, 'legal')));

/* Each tools/<slug>/index.html is a user-facing page too: the end
   user can land there directly from the home-screen icon, a deep link,
   or by following a sibling-app link, so the SPEC §4 zero-mentions
   rule applies. */
(function userFacingTools() {
  var toolsDir = path.join(ROOT, 'tools');
  if (!fs.existsSync(toolsDir)) return;
  fs.readdirSync(toolsDir).forEach(function (name) {
    var full = path.join(toolsDir, name);
    if (fs.statSync(full).isDirectory()) {
      var idx = path.join(full, 'index.html');
      if (fs.existsSync(idx)) userFacingTargets.push(idx);
    }
  });
})();
userFacingTargets.forEach(function (file) {
  var content = fs.readFileSync(file, 'utf8').toLowerCase();
  FORBIDDEN_TERMS.forEach(function (entry) {
    var term = entry.term;
    var hit;
    if (entry.match === 'word') {
      hit = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(content);
    } else {
      hit = content.indexOf(term.toLowerCase()) !== -1;
    }
    if (hit) {
      failures.push(rel(file) + ': contains "' + term + '" — no page visible to the user may mention disability, occupational therapy, or minors (see doc/en/spec.md §4)');
    }
  });
});

/* --- 6. _headers: CSP source-expression quoting --- */
checks += 1;
var headersContent = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
headersContent.split('\n').filter(function (line) {
  return /^\s*Content-Security-Policy:/i.test(line);
}).forEach(function (line) {
  var value = line.replace(/^\s*Content-Security-Policy:/i, '');
  value.split(';').forEach(function (directive) {
    directive.trim().split(/\s+/).filter(Boolean).forEach(function (token) {
      var quoteCount = (token.match(/'/g) || []).length;
      if (quoteCount === 0) return;
      var wellFormed = quoteCount === 2 && token[0] === "'" && token[token.length - 1] === "'";
      if (!wellFormed) {
        failures.push('_headers: malformed CSP source expression "' + token +
          '" — quotes should wrap the keyword exactly once (e.g. \'self\', not \'\'self\'\')');
      }
    });
  });
});

/* --- 7. Usage vs. registration ---
   "Registered" for a given page is not just its strings.<locale>.js:
   assets/js/money.js also calls App.i18n.register() for its own
   'money.*' / 'practice.*' keys, and assets/js/i18n.js seeds 'core.*' /
   'feedback.*' globally via a hardcoded DICT literal. So the page's
   actual <script src> list (read straight from its HTML, in document
   order) is replayed through a sandboxed App.i18n.register() to build
   the same dictionary the browser ends up with, then every key actually
   used on that page is checked against it, per locale. This is the
   check apptonomia's scripts/i18n-keys-smoke.js does for tools/<slug>/;
   adapted here to also read the <script src> list instead of assuming a
   fixed file set, since okeymoney's root app and tools/<slug> share
   assets/js modules that themselves register keys. */
(function checkUsageVsRegistration() {
  /* assets/js/i18n.js seeds DICT.es / DICT.en with 'core.*' and
     'feedback.*' before any register() call runs; pull that literal out
     without executing the rest of the file (it touches document/
     navigator/localStorage at load time, which this sandbox does not
     stub). */
  function extractCoreDict() {
    var file = path.join(ROOT, 'assets', 'js', 'i18n.js');
    var src = fs.readFileSync(file, 'utf8');
    var m = src.match(/var DICT = (\{[\s\S]*?\n {2}\});\s*\n\s*function detect\(\)/);
    if (!m) return { es: {}, en: {} };
    try {
      return vm.runInNewContext('(' + m[1] + ')');
    } catch (e) {
      return { es: {}, en: {} };
    }
  }

  /* Runs a .js file in a sandbox that only understands
     App.i18n.register(dict, loc); mirrors the real register() merge
     (shallow, per top-level key, last call wins) so a file that
     registers more than once per locale — none do today, but money.js
     registers once per locale in the same file — is captured correctly.
     Any other browser API the file touches (document, localStorage...)
     throws inside the sandbox; that's fine, we only care about
     register() calls, and the ones already executed before the throw
     are kept. */
  function extractRegisterCalls(file) {
    var result = { es: {}, en: {} };
    var sandbox = {
      App: { i18n: { register: function (dict, loc) {
        if (!dict || typeof dict !== 'object') return;
        if (loc !== 'es' && loc !== 'en') return;
        Object.keys(dict).forEach(function (k) { result[loc][k] = dict[k]; });
      } } },
      window: {}
    };
    sandbox.window = sandbox;
    try {
      vm.createContext(sandbox);
      vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file, timeout: 2000 });
    } catch (e) { /* file leans on browser globals we don't stub — ignore */ }
    return result;
  }

  function extractScriptSrcs(htmlFile) {
    var src = fs.readFileSync(htmlFile, 'utf8');
    var out = [];
    var re = /<script\s+[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/script>/g;
    var m;
    while ((m = re.exec(src)) !== null) {
      if (!/^https?:\/\//i.test(m[2])) {
        /* Ignore cache-busting query strings when resolving the local file. */
        out.push(m[2].split(/[?#]/)[0]);
      }
    }
    return out;
  }

  function collectAttrKeys(text, attr) {
    var keys = [];
    var re = new RegExp(attr + '="([^"]+)"', 'g');
    var m;
    while ((m = re.exec(text)) !== null) keys.push(m[1]);
    return keys;
  }

  /* App.i18n.t('foo') / App.i18n.t('a.b.c') / App.i18n.t('foo', ...).
     For a concatenation like App.i18n.t('categories.' + id) this
     captures the literal prefix ('categories.'); resolved against the
     registered-keys prefix check below, not an exact match. Calls whose
     first argument isn't a string literal (e.g. App.i18n.t(opts.titleKey))
     aren't statically resolvable and are skipped, same limitation as
     apptonomia's smoke test. */
  function collectCallKeys(text) {
    var keys = [];
    var re = /App\.i18n\.t\(\s*(['"])([^'"]+)\1/g;
    var m;
    while ((m = re.exec(text)) !== null) keys.push(m[2]);
    return keys;
  }

  var coreDict = extractCoreDict();

  function buildDomain(htmlFile) {
    var dir = path.dirname(htmlFile);
    var scripts = extractScriptSrcs(htmlFile)
      .map(function (s) { return path.join(dir, s); })
      .filter(function (f) {
        return f.slice(-3) === '.js' && path.basename(f) !== 'i18n.js' && fs.existsSync(f);
      });
    var registered = { es: {}, en: {} };
    ['es', 'en'].forEach(function (loc) {
      Object.keys(coreDict[loc] || {}).forEach(function (k) { registered[loc][k] = coreDict[loc][k]; });
    });
    /* Deep-merge helper: the previous shallow `Object.keys(...).forEach`
       assignment made a later script's `practice: { tokensSuffix: '…' }`
       overwrite an earlier script's `practice: { name, plural, sub, symbol }`,
       dropping the latter keys. That is why introducing `practice.*`
       in a later strings.<locale>.js surfaced as "unregistered" failures
       for keys that money.js had registered earlier. Merge plain objects
       instead of replacing. */
    function deepMerge(target, src) {
      Object.keys(src || {}).forEach(function (k) {
        var sv = src[k];
        var tv = target[k];
        if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
            tv && typeof tv === 'object' && !Array.isArray(tv)) {
          deepMerge(tv, sv);
        } else {
          target[k] = sv;
        }
      });
      return target;
    }
    scripts.forEach(function (f) {
      var reg = extractRegisterCalls(f);
      ['es', 'en'].forEach(function (loc) {
        deepMerge(registered[loc], reg[loc]);
      });
    });
    var htmlSrc = fs.readFileSync(htmlFile, 'utf8');
    var used = [];
    ['data-i18n', 'data-i18n-aria', 'data-i18n-meta', 'data-i18n-title'].forEach(function (attr) {
      used = used.concat(collectAttrKeys(htmlSrc, attr));
    });
    scripts.forEach(function (f) {
      used = used.concat(collectCallKeys(fs.readFileSync(f, 'utf8')));
    });
    return {
      es: flattenKeys(registered.es, '').sort(),
      en: flattenKeys(registered.en, '').sort(),
      used: Array.from(new Set(used))
    };
  }

  function checkDomain(htmlFile) {
    checks += 1;
    var domain = buildDomain(htmlFile);
    ['es', 'en'].forEach(function (loc) {
      var set = domain[loc];
      domain.used.forEach(function (key) {
        if (set.indexOf(key) !== -1) return;
        var hasFamily = set.some(function (rk) { return rk.indexOf(key) === 0; });
        if (hasFamily) return;
        failures.push(rel(htmlFile) + ': [' + loc + '] key "' + key +
          '" is used (data-i18n* or App.i18n.t) but not registered by any script this page loads');
      });
    });
  }

  var targets = [
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'offline.html'),
    path.join(ROOT, 'legal', 'index.html')
  ].filter(function (f) { return fs.existsSync(f); });
  var toolsDir = path.join(ROOT, 'tools');
  if (fs.existsSync(toolsDir)) {
    fs.readdirSync(toolsDir).forEach(function (name) {
      var idx = path.join(toolsDir, name, 'index.html');
      if (fs.existsSync(idx)) targets.push(idx);
    });
  }
  targets.forEach(checkDomain);
})();

/* --- 8. Content catalog integrity --- */
(function checkActivityRoutes() {
  checks += 1;
  var sandbox = {};
  try {
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8'), sandbox);
  } catch (e) {
    failures.push('data.js: could not load DATA for activity route check');
    return;
  }
  var data = sandbox.DATA || {};
  var rootEs = extractDictFromStrings(path.join(ROOT, 'strings.es.js')) || {};
  var rootEn = extractDictFromStrings(path.join(ROOT, 'strings.en.js')) || {};
  function hasKey(dict, key) {
    return String(key || '').split('.').reduce(function (value, part) {
      return value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : null;
    }, dict) !== null;
  }
  var units = data.learningPath || [];
  var unitIds = {};
  units.forEach(function (unit) {
    if (!unit || !unit.id) return;
    if (unitIds[unit.id]) failures.push('data.js: duplicate learning unit ' + unit.id);
    unitIds[unit.id] = true;
  });
  var activitySlugs = {};
  (data.activities || []).forEach(function (activity) {
    if (!activity || !activity.slug) return;
    if (activitySlugs[activity.slug]) failures.push('data.js: duplicate activity ' + activity.slug);
    activitySlugs[activity.slug] = true;
    if (!activity.unitId || !unitIds[activity.unitId]) {
      failures.push('data.js: activity ' + activity.slug + ' points to missing unit ' + activity.unitId);
    }
    if (!activity.available) return;
    var target = path.join(ROOT, String(activity.href || '').replace(/^\.\//, ''));
    if (!activity.href || !fs.existsSync(target)) {
      failures.push('data.js: activity ' + activity.slug + ' points to a missing route ' + activity.href);
    }
  });
  units.forEach(function (lesson) {
    var row = lesson;
    var activities = (data.activities || []).filter(function (activity) {
      return activity.unitId === row.id && activity.available;
    });
    if (!activities.length) {
      failures.push('data.js: learning unit ' + lesson.id + ' has no mapped activity');
      return;
    }
    if (!Array.isArray(row.steps) || row.steps.length !== 3) {
      failures.push('data.js: learning unit ' + lesson.id + ' must have exactly 3 explanation steps');
    }
    if (!row.exampleKey) {
      failures.push('data.js: learning unit ' + lesson.id + ' has no explanation example');
    }
  });
  var simulationIds = {};
  var allowedGroups = { organise: true, buy: true, check: true };
  var allowedActions = {
    balance: true, income: true, goals: true, expense: true, plan: true,
    purchase: true, commitment: true, depreciation: true, obsolescence: true,
    return: true, risk: true, investment: true, bankProducts: true,
    housing: true, change: true, safety: true, rights: true,
    communication: true, emergency: true
  };
  (data.simulations || []).forEach(function (simulation) {
    if (!simulation || !simulation.id) return;
    if (simulationIds[simulation.id]) failures.push('data.js: duplicate simulation ' + simulation.id);
    simulationIds[simulation.id] = true;
    if (!simulation.unitId || !unitIds[simulation.unitId]) failures.push('data.js: simulation ' + simulation.id + ' points to missing unit ' + simulation.unitId);
    if (!allowedGroups[simulation.group]) failures.push('data.js: simulation ' + simulation.id + ' has unknown group ' + simulation.group);
    if (!allowedActions[simulation.action]) failures.push('data.js: simulation ' + simulation.id + ' has unknown action ' + simulation.action);
    if (!simulation.titleKey || !simulation.detailKey) failures.push('data.js: simulation ' + simulation.id + ' needs titleKey and detailKey');
    if (!hasKey(rootEs, simulation.titleKey) || !hasKey(rootEn, simulation.titleKey)) failures.push('data.js: simulation ' + simulation.id + ' has an unregistered titleKey');
    if (!hasKey(rootEs, simulation.detailKey) || !hasKey(rootEn, simulation.detailKey)) failures.push('data.js: simulation ' + simulation.id + ' has an unregistered detailKey');
  });
})();
/* --- 9. _redirects stays within Cloudflare's per-file limits
   (https://developers.cloudflare.com/pages/configuration/redirects/):
   a maximum of 2 000 static redirects and 100 dynamic (placeholder)
   redirects per file — 2 100 in total. If the file is absent (the
   common case for projects that have no redirects at all) the check
   is skipped: zero is valid. Cloudflare parses the file line-by-line
   and counts entries, not bytes, so the check counts entries.

   - Static: a non-comment, non-blank line with a redirect code
     (301/302/303/307/308) at the end OR a proxy entry (`200`). The
     `301`/`302`/`303`/`307`/`308` codes all sit at the end of the
     line in Cloudflare's syntax (`/from /to 301`).
   - Dynamic: a redirect line containing a `:placeholder$` token
     (e.g. `/news/:slug$ /blog/:slug 301`), per the Cloudflare docs'
     "Dynamic redirects" section. */
var REDIRECTS_FILE = path.join(ROOT, '_redirects');
if (fs.existsSync(REDIRECTS_FILE)) {
  checks += 1;
  var redirLines = fs.readFileSync(REDIRECTS_FILE, 'utf8').split('\n');
  var staticCount = 0;
  var dynamicCount = 0;
  redirLines.forEach(function (line) {
    var trimmed = line.trim();
    if (!trimmed || trimmed.charAt(0) === '#') return;
    var isStatic = /\s(?:200|301|302|303|307|308)\s*$/.test(trimmed) && !/:\w+\$/.test(trimmed);
    var isDynamic = /:\w+\$/.test(trimmed);
    if (isStatic) staticCount += 1;
    else if (isDynamic) dynamicCount += 1;
  });
  var REDIR_STATIC_LIMIT = 2000;
  var REDIR_DYNAMIC_LIMIT = 100;
  if (staticCount > REDIR_STATIC_LIMIT) {
    failures.push('_redirects: ' + staticCount + ' static redirects, max is ' + REDIR_STATIC_LIMIT +
      ' (Cloudflare Pages rejects the file)');
  }
  if (dynamicCount > REDIR_DYNAMIC_LIMIT) {
    failures.push('_redirects: ' + dynamicCount + ' dynamic redirects, max is ' + REDIR_DYNAMIC_LIMIT +
      ' (Cloudflare Pages rejects the file)');
  }
}

/* --- 10. _headers stays within Cloudflare's per-file limit of 100
   header rules per file
   (https://developers.cloudflare.com/pages/configuration/headers/).
   A "rule" is one path-glob block: the glob line plus the indented
   header lines that follow it. We count both the path-glob line AND
   the header lines individually because Cloudflare's published limit
   of 100 applies to the total number of lines in `_headers`
   (path-glob lines + header lines), per the wording at
   https://developers.cloudflare.com/pages/configuration/headers/. The
   7 currently shipped suites all stay well under 100 either way. */
var HEADERS_FILE = path.join(ROOT, '_headers');
if (fs.existsSync(HEADERS_FILE)) {
  checks += 1;
  var headersLines = fs.readFileSync(HEADERS_FILE, 'utf8').split('\n');
  var ruleCount = 0;
  for (var i = 0; i < headersLines.length; i++) {
    var hLine = headersLines[i];
    var hTrim = hLine.trim();
    if (!hTrim || hTrim.charAt(0) === '#') continue;
    if (hLine.charAt(0) === '/' && !/^\/.*:/.test(hLine)) {
      ruleCount += 1;
      continue;
    }
    if (/^[A-Za-z][\w-]*:\s/.test(hLine)) ruleCount += 1;
  }
  var HEADERS_RULE_LIMIT = 100;
  if (ruleCount > HEADERS_RULE_LIMIT) {
    failures.push('_headers: ' + ruleCount + ' rule lines (path-globs + headers), max is ' +
      HEADERS_RULE_LIMIT + ' (Cloudflare Pages rejects the file)');
  }
}

/* --- 11. No shipped file exceeds Cloudflare Pages' 25 MB per-file
   limit (https://developers.cloudflare.com/pages/limits/). Warns at
   20 MB (legal but worth a nudge) and fails at 25 MB. Only walks
   files that actually deploy: `.git/`, `node_modules/`, `.claude/`
   (graphify skill + agent settings, never uploaded), and
   `graphify-out*` (build artifacts) are excluded. */
var FILE_SIZE_WARN_MB = 20;
var FILE_SIZE_FAIL_MB = 25;
var fileSizeExcluded = ['.git', 'node_modules', '.claude', 'graphify-out', 'graphify-out-meta'];
(function walkForLargeFiles(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    if (fileSizeExcluded.indexOf(entry.name) !== -1) return;
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkForLargeFiles(full);
    } else if (entry.isFile()) {
      checks += 1;
      var size = fs.statSync(full).size;
      var sizeMb = size / (1024 * 1024);
      if (sizeMb >= FILE_SIZE_FAIL_MB) {
        failures.push(rel(full) + ': weighs ' + sizeMb.toFixed(2) + ' MB, max per file is ' +
          FILE_SIZE_FAIL_MB + ' MB (Cloudflare Pages rejects the deploy)');
      } else if (sizeMb >= FILE_SIZE_WARN_MB) {
        warnings.push(rel(full) + ': weighs ' + sizeMb.toFixed(2) + ' MB, max per file is ' +
          FILE_SIZE_FAIL_MB + ' MB (warning: still legal, getting close)');
      }
    }
  });
})(ROOT);

/* --- Result --- */
if (warnings.length) {
  console.log('WARNINGS (' + warnings.length + ') - non-blocking, see https://developers.cloudflare.com/pages/limits/ (25 MB per-file limit):');
  warnings.forEach(function (w) { console.log('  - ' + w); });
  console.log('');
}
if (failures.length) {
  console.log('FAILURES (' + failures.length + '):');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
