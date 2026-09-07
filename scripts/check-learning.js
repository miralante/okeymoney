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
  const expectedTopics = ['money','choices','budget','beforeBuying','change','saving','safety','documents','assets','accounting','assetLifecycle','returnRisk','investmentOperations','bankProducts','housing'];
  check(()=>assert.deepStrictEqual(Array.from(context.DATA.topics, t=>t.id), expectedTopics));
  for (const topic of context.DATA.topics) {
    for (const suffix of ['Title','Detail','Body']) {
      const key='blocks.didactic.lessons.'+topic.id+suffix;
      check(()=>assert.notStrictEqual(context.App.i18n.t(key),key));
    }
    check(()=>assert(topic.activities.length+topic.simulations.length>0));
    for (const slug of topic.activities) check(()=>assert(context.DATA.activities.some(a=>a.slug===slug && a.available)));
    for (const id of topic.simulations) check(()=>assert(context.DATA.simulations.some(a=>a.id===id)));
  }
  // Execute the actual catalogue renderer with a small element adapter.
  // This guards against a renderer silently dropping available activities.
  function element() {return {children:[],style:{setProperty(){}},setAttribute(){},appendChild(child){this.children.push(child);}};}
  const catalogue=element();
  const rendererContext={DATA:context.DATA,App:{i18n:context.App.i18n,utils:{escapeHtml:s=>s},wallet:{activityStatus:()=>null}},document:{createElement:element},$:()=>catalogue};
  const appSource=fs.readFileSync(path.join(root,'app.js'),'utf8');
  const start=appSource.indexOf('  function renderActivityCatalog()');
  const end=appSource.indexOf('  function renderDidacticLessons(',start);
  vm.runInNewContext(appSource.slice(start,end)+';renderActivityCatalog();',rendererContext);
  const cards=catalogue.children.flatMap(section=>section.children[1].children);
  check(()=>assert.strictEqual(cards.length,context.DATA.activities.filter(a=>a.available).length));
  check(()=>assert.strictEqual(new Set(cards.map(c=>c.href)).size,cards.length));
  check(()=>assert(cards.some(c=>c.href==='tools/budget-first/index.html')));
  for(const card of cards) check(()=>assert(!card.innerHTML.includes('learn.activity')));
  check(()=>assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('id="activityCatalog"')));

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

// Rehearsal must never modify either ledger. Execute the actual purchase flow.
const appSource=fs.readFileSync(path.join(root,'app.js'),'utf8');
const purchaseSource=appSource.slice(appSource.indexOf('  function renderPurchaseLifecycle()'),appSource.indexOf('  /* ---------- Local settings',appSource.indexOf('  function renderPurchaseLifecycle()')));
for (const mode of ['practice','record']) {
  const elements={};
  const get=selector=>elements[selector]||(elements[selector]={innerHTML:'',disabled:false,addEventListener(type,fn){this[type]=fn;}});
  let saves=0,credits=0;
  const context={wizard:{purchaseMode:mode,scenarioIndex:0,stage:3},state:{movements:[]},DATA:{purchaseLifecycleScenarios:[{id:'sample',priceCents:2500,categoryId:'food'},{id:'second',priceCents:9000,categoryId:'health'}]},$:get,wireChrome(){},wizardChrome:()=>'',balanceCents:()=>10000,save(){saves++;},closeWizard(){},App:{i18n:{t:k=>k==='journey.receipt'?'{before} - {cost} = {after}':k},money:{format:n=>String(n)},utils:{escapeHtml:s=>s,uid:()=> 'test',today:()=> '2026-09-07'},wallet:{credit(){credits++;}},feedback:{success(){},celebrate(){}}}};
  vm.createContext(context);vm.runInContext(purchaseSource+';renderPurchaseLifecycle();',context);
  get('#purchasePay').click();
  check(()=>assert.strictEqual(context.state.movements.length,mode==='practice'?0:1));
  check(()=>assert.strictEqual(saves,mode==='practice'?0:1));
  check(()=>assert.strictEqual(credits,0));
  if(mode==='practice') {
    check(()=>assert(get('#screen-wizard').innerHTML.includes('10000 - 2500 = 7500')));
    get('#purchaseAnother').click();
    check(()=>assert.strictEqual(context.wizard.scenarioIndex,1));
    check(()=>assert.strictEqual(context.wizard.stage,0));
    check(()=>assert.strictEqual(saves,0));
  }
  // An unaffordable recorded payment cannot be confirmed.
  context.wizard={purchaseMode:'record',scenarioIndex:1,stage:3};
  context.balanceCents=()=>100;
  vm.runInContext('renderPurchaseLifecycle();',context);
  check(()=>assert.strictEqual(get('#purchasePay').disabled,true));
  const count=context.state.movements.length;
  get('#purchasePay').click();
  check(()=>assert.strictEqual(context.state.movements.length,count));
}
const progressContext={App:{storage:{get:k=>k==='activity:done'?{done:true}:{},set(){}},utils:{today:()=>''}}};
progressContext.window=progressContext;vm.createContext(progressContext);load('assets/js/wallet.js',progressContext);
const available=[{slug:'done',available:true},{slug:'next',available:true},{slug:'hidden',available:false}];
const progress=progressContext.App.wallet.practiceProgress(available);
check(()=>assert.strictEqual(progress.completed,1));
check(()=>assert.strictEqual(progress.total,2));
check(()=>assert.strictEqual(progress.nextSlug,'next'));
check(()=>assert.strictEqual(progressContext.App.wallet.practiceProgress(available.slice(0,1)).nextSlug,null));
const dataContext=vm.createContext({});load('data.js',dataContext);
const groups=['record','shop','protect','compare','invest'];
check(()=>assert.strictEqual(dataContext.DATA.blocks.length,3));
for(const item of dataContext.DATA.simulations) check(()=>assert(groups.includes(item.catalogGroup)));
for(const group of groups) check(()=>assert(dataContext.DATA.simulations.filter(s=>s.catalogGroup===group).length<=6));
console.log('OK ('+checks+' learning checks)');
