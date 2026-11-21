// tests/app.spec.js — the flows of Okeymoney itself.
//
// The shared smoke (tests/smoke.spec.js) checks the contract of the suite:
// the page loads, the settings drawer opens, the 404 answers. This spec
// checks what makes Okeymoney Okeymoney: the home with its three learning
// blocks, the money ledger (balance, expenses), the didactic catalogue, the
// backup of the data and the reset of the settings page.
//
// Rules of the spec:
//   - every check waits for the state it needs (`toBeVisible`, `toHaveText`),
//     never for a fixed number of milliseconds;
//   - the texts are asked to the app itself (App.money.format, App.i18n.t),
//     so the spec does not depend on the active language or on the decimal
//     separator;
//   - the page must not print a console error (watchErrors).
'use strict';

const { test, expect } = require('./playwright.js');

/* Fails the test on any console error or uncaught exception of the page. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  return errors;
}

/* The app formats the money with the active locale ("5,00 €" in Spanish,
   "5.00 €" in English), so the expected text is asked to the app instead of
   being hard-coded here. */
async function moneyText(page, cents) {
  return page.evaluate((value) => window.App.money.format(value), cents);
}

/* The amount wizard is a keypad, not a text field: the amount is typed key
   by key (the last key wins, the previous digits are pushed to the left). */
async function pressKey(page, key) {
  await page.locator('#wizKeypad .keypad-key')
    .filter({ hasText: new RegExp(`^${key}$`) })
    .click();
}

/* The service worker would serve the cached copy of the app between tests.
   The specs check the code of this repository, not the cache of a previous
   visit, so the registration is blocked. */
test.use({ serviceWorkers: 'block' });

test('the home shows the three learning blocks with their catalogues', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./');

  // The home is one long scroll with three parts; all three must be there.
  await expect(page.locator('#block-didactico')).toBeVisible();
  await expect(page.locator('#block-simulacion')).toBeVisible();
  await expect(page.locator('#block-cuidado')).toBeVisible();

  // The didactic part lists its units and the small activities that
  // practise them.
  await expect(page.locator('#didacticLessons .topic-card').first()).toBeVisible();
  await expect(page.locator('#activityCatalog .activity-card').first()).toBeVisible();

  // The practice summary shows how much of the catalogue is done.
  await expect(page.locator('#practiceSummary progress')).toBeVisible();

  // The simulation part lists the actions with money.
  await expect(page.locator('#simulationCatalog .simulation-card').first()).toBeVisible();
  await expect(page.locator('#financialCycle .financial-cycle__step').first()).toBeVisible();

  expect(errors).toEqual([]);
});

test('the next step records how much money the person has', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./');

  // With no movements and no balance, the home asks for the balance first.
  const nextStep = page.locator('#nextStepAction');
  await expect(nextStep).toBeVisible();
  await expect(nextStep).toHaveAttribute('data-next-action', 'balance');
  await nextStep.click();

  // The wizard asks the amount with the shared keypad.
  await expect(page.locator('#screen-wizard')).toBeVisible();
  await expect(page.locator('#wizAmount')).toBeVisible();

  await pressKey(page, '5');
  await pressKey(page, '0');
  await pressKey(page, '0');
  await expect(page.locator('#wizAmount')).toHaveText(await moneyText(page, 500));

  // 500 cents is more than zero, so the amount can be confirmed.
  await expect(page.locator('#wizNext')).toBeEnabled();
  await page.locator('#wizNext').click();

  // The app congratulates and waits for the person before closing the wizard.
  const celebration = page.locator('#app-celebration');
  await expect(celebration).toBeVisible();
  await celebration.locator('.celebration-more').click();
  await expect(page.locator('#screen-wizard')).toBeHidden();

  // The balance is kept and shown in the home.
  await expect(page.locator('#simulationBalanceValue')).toHaveText(await moneyText(page, 500));
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('okeymoney:data')));
  expect(saved.initialBalanceCents).toBe(500);

  expect(errors).toEqual([]);
});

test('an expense is recorded and the balance goes down', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./');

  // The catalogue of actions opens the three-step expense wizard.
  await page.locator('#simulation-card-expense').click();
  await expect(page.locator('#categoryGrid')).toBeVisible();
  await page.locator('#categoryGrid .btn-option').first().click();

  // Amount: 100 cents.
  await expect(page.locator('#wizKeypad')).toBeVisible();
  await pressKey(page, '1');
  await pressKey(page, '0');
  await pressKey(page, '0');
  await expect(page.locator('#wizAmount')).toHaveText(await moneyText(page, 100));
  await page.locator('#wizNext').click();

  // The third step confirms the expense before it is saved.
  await expect(page.locator('#wizSave')).toBeVisible();
  await page.locator('#wizSave').click();

  await expect(page.locator('#app-celebration')).toBeVisible();
  await page.locator('#app-celebration .celebration-more').click();
  await expect(page.locator('#screen-wizard')).toBeHidden();

  // The movement is in the ledger and the balance is now negative.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('okeymoney:data')));
  expect(saved.movements).toHaveLength(1);
  expect(saved.movements[0].type).toBe('expense');
  expect(saved.movements[0].amountCents).toBe(100);
  await expect(page.locator('#simulationBalanceValue')).toHaveText(await moneyText(page, -100));
  await expect(page.locator('#movementSummary .movement-summary__list li')).toHaveCount(1);

  expect(errors).toEqual([]);
});

test('a didactic unit opens its lesson and the back link gives the catalogue back',
  async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('./');

    await page.locator('#didacticLessons .topic-card').first().click();

    // The lesson takes the place of the catalogue, and the URL carries the
    // unit so the lesson can be shared as a link.
    const detail = page.locator('#lessonDetail');
    await expect(detail).toBeVisible();
    await expect(page.locator('#lessonDetailTitle')).not.toBeEmpty();
    expect(new URL(page.url()).hash).toMatch(/^#unidad-/);
    await expect(page.locator('#didacticLessons')).toBeHidden();

    // The back link closes the lesson and the catalogue comes back.
    await page.locator('#lessonDetailBack').click();
    await expect(detail).toBeHidden();
    await expect(page.locator('#didacticLessons')).toBeVisible();

    expect(errors).toEqual([]);
  });

test('the settings wizard exports a backup and refuses an invalid import', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('./');

  await page.locator('#btnSettings').click();
  await expect(page.locator('#screen-wizard')).toBeVisible();
  await expect(page.locator('#btnExportData')).toBeVisible();

  // The export downloads a JSON copy of everything the app keeps.
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btnExportData').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^okeymoney-backup-.*\.json$/);

  // A file that is not a backup must be refused, and the person has to be
  // told why (the text is asked to the app, so the language does not matter).
  const importError = await page.evaluate(() => window.App.i18n.t('settings.importError'));
  await page.locator('#dataImport').setInputFiles({
    name: 'backup-invalido.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{}'),
  });
  await expect(page.locator('#settingsFeedback')).toHaveText(importError);

  expect(errors).toEqual([]);
});

test('the settings page clears the data of Okeymoney and nothing else', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/config/');

  // The page tells what this browser keeps.
  await expect(page.locator('#listaEstado li')).toHaveCount(6);

  // The data of the app and a key of another app that shares the browser.
  await page.evaluate(() => {
    localStorage.setItem('okeymoney:data', JSON.stringify({ initialBalanceCents: 5000, movements: [] }));
    localStorage.setItem('otra-app:datos', 'no tocar');
  });

  // The reset asks for a second tap before it deletes anything.
  await page.locator('#btnBorrarTodo').click();
  await page.locator('#btnBorrarTodo').click();

  await expect(page.locator('#feedbackTodo')).not.toBeEmpty();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.filter((key) => key.startsWith('okeymoney:'))).toEqual([]);
  expect(keys).toContain('otra-app:datos');

  expect(errors).toEqual([]);
});
