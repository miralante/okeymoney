/* Behaviour and content regressions for the shared learning contracts. */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const load = (file, context) => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
let checks = 0;
function check(fn) { fn(); checks++; }
for (const locale of ['es', 'en']) {
  const store = {};
  const context = vm.createContext({navigator:{language:locale}, localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v;}},location:{reload(){}},document:{readyState:'loading',addEventListener(){},querySelectorAll:()=>[]}});
  context.window = context;
  load('assets/js/i18n.js', context);
  load('strings.'+locale+'.js', context);
  load('assets/js/money.js', context);
  check(()=>assert(context.App.money.format(230).includes('€')));
  check(()=>assert.strictEqual(context.App.money.info(200).css,'money-c2'));
  check(()=>assert.strictEqual(context.App.money.info(25),undefined));
  check(()=>assert.strictEqual(context.App.money.breakdown(237).reduce((a,b)=>a+b,0),237));
  check(()=>assert.notStrictEqual(context.App.i18n.t('core.dataProtection'),'core.dataProtection'));
  check(()=>assert.notStrictEqual(context.App.i18n.t('core.keypad.check'),'core.keypad.check'));
  load('data.js', context);
  for (const entry of context.DATA.activities) {
    check(()=>assert.notStrictEqual(context.App.i18n.t('learn.activityTitle.'+entry.slug),'learn.activityTitle.'+entry.slug));
  }
  for (const slug of ['save-step-by-step','compare-prices','monthly-payments','go-shopping','my-shopping-day']) {
    let options;
    context.App.activity={run:o=>{options=o;}};
    load('tools/'+slug+'/strings.'+locale+'.js',context);
    load('tools/'+slug+'/app.js',context);
    for(const c of options.casos) {
      check(()=>assert(c.correctaIndex >= 0 && c.correctaIndex < c.opciones.length));
      for(const key of [c.sceneKey,c.instruccionKey,c.pistaKey,c.explicacionKey,...c.opciones].filter(k=>typeof k==='string')) {
        check(()=>assert.notStrictEqual(context.App.i18n.t(key),key));
      }
    }
    if(slug==='go-shopping') {
      const c=options.casos.find(c=>c.id==='s6');
      check(()=>assert.strictEqual(c.opciones[c.correctaIndex],'opLibroTiritas2'));
      check(()=>assert(800+300<=2000 && 1500+800>2000));
    }
    if(slug==='my-shopping-day') {
      check(()=>assert.strictEqual(options.shuffleCases,false));
      check(()=>assert(context.App.i18n.t('d4expl').includes('2,70') || context.App.i18n.t('d4expl').includes('2.70')));
    }
  }
  context.App.storage={get:k=>store[k],set:(k,v)=>{store[k]=v;}};
  context.App.utils={today:()=> '2026-09-05'};
  load('assets/js/wallet.js',context);
  context.App.wallet.markActivityDone('example',99);
  check(()=>assert.strictEqual('attempts' in store['activity:example'],false));
  check(()=>assert.strictEqual(store['activity:example'].done,true));
}
console.log('OK ('+checks+' learning checks)');
