import {test, expect} from '@playwright/test';

test('credits preserve attribution, keyboard focus and multiplayer input isolation', async ({page, context, baseURL}) => {
  await page.goto(baseURL!);
  await expect(page.locator('#room-panel')).toContainText('Connected');
  await page.getByRole('button', {name: 'Options', exact: true}).click();
  const trigger = page.getByRole('button', {name: 'Credits', exact: true});
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', {name: 'Credits / Licenses'});
  const close = dialog.getByRole('button', {name: 'Close credits'});
  await expect(close).toBeFocused();
  await expect(dialog.locator('article')).toHaveCount(1);
  await expect(dialog).toContainText('By dotflare');
  await expect(dialog).toContainText('Modified: converted/optimized to GLB, animated for JAC Works.');
  await expect(dialog.getByRole('link', {name: 'Original model (Sketchfab)'})).toHaveAttribute('href', 'https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab');
  const license = dialog.getByRole('link', {name: 'CC BY 4.0', exact: true});
  const url = 'https://creativecommons.org/licenses/by/4.0/';
  await expect(license).toHaveAttribute('href', url);
  await expect(license).toHaveAttribute('target', '_blank');
  await expect(license).toHaveAttribute('rel', 'noopener noreferrer');
  // Check actual navigation without relying on the external site's availability.
  await context.route(url, route => route.fulfill({body: '<title>License destination</title>'}));
  const popupPromise = page.waitForEvent('popup');
  await license.click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(url);
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
  await license.focus();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(license).toBeFocused();
  const roster = await page.locator('#room-roster').innerHTML();
  await page.keyboard.down('d');
  await page.waitForTimeout(250);
  await page.keyboard.up('d');
  await page.keyboard.press('e');
  await page.keyboard.press('r');
  await expect(page.locator('#room-roster')).toHaveJSProperty('innerHTML', roster);
  await expect(page.locator('#encounter-vote')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator('#options-panel')).toBeVisible();
  await trigger.click();
  await close.click();
  await expect(trigger).toBeFocused();
});

test('credits fit a small viewport and support keyboard scrolling as the catalog grows', async ({page, baseURL}) => {
  await page.setViewportSize({width: 375, height: 420});
  await page.goto(baseURL!);
  await page.getByRole('button', {name: 'Options', exact: true}).click();
  await page.getByRole('button', {name: 'Credits', exact: true}).click();
  const dialog = page.getByRole('dialog');
  const scroll = dialog.getByRole('region', {name: 'Third-party asset credits'});
  // Simulate future entries without adding fictitious credits to the shipped catalog.
  await scroll.evaluate(element => {
    const entry = element.querySelector('article')!;
    for (let i = 0; i < 20; i++) element.append(entry.cloneNode(true));
  });
  await scroll.focus();
  await page.keyboard.press('End');
  await expect.poll(() => scroll.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  const bounds = await dialog.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(420);
  await expect(dialog.getByRole('button', {name: 'Close credits'})).toBeInViewport();
  await page.screenshot({path: 'test-results/credits-mobile.png'});
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', {name: 'Credits', exact: true})).toBeFocused();
});
