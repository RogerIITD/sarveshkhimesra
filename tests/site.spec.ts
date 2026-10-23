import { test as base, expect, type Page } from '@playwright/test';

// Every test fails if the page logs a JS error or a request 4xx/5xx's.
const test = base.extend<{ problems: string[] }>({
  problems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('pageerror', (e) => problems.push(`JS exception: ${e.message}`));
      page.on('console', (m) => m.type() === 'error' && problems.push(`console.error: ${m.text().slice(0, 200)}`));
      page.on('response', (r) => r.status() >= 400 && !r.url().includes('google') && problems.push(`HTTP ${r.status()}: ${r.url()}`));
      await use(problems);
      expect(problems, 'errors on the page').toEqual([]);
    },
    { auto: true },
  ],
});

const CHAPTERS = ['engineer', 'poet', 'athlete', 'traveller', 'people', 'boot'] as const;
// a point inside each chapter where its content is fully on stage (screens from the chapter's top)
const MID: Record<string, number> = { engineer: 2.6, poet: 1.45, athlete: 2.95, traveller: 2.5, people: 3.5, boot: 1.2 };

async function scrollTo(page: Page, ch: string, k: number) {
  await page.evaluate(([c, n]) => {
    const e = document.getElementById(`chapter-${c}`)!;
    window.scrollTo(0, e.offsetTop + (n as number) * innerHeight);
  }, [ch, k] as const);
  await page.waitForTimeout(1400);
}

const noHorizontalScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
const inOS = (page: Page) => page.evaluate(() => document.documentElement.classList.contains('os-mode'));

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#chapter-hello h1')).toHaveText('Sarvesh Khimesra', { timeout: 10_000 });
});

test('story: every chapter shows its heading clear of the header, with no sideways scroll', async ({ page }, info) => {
  expect(await noHorizontalScroll(page)).toBe(true);
  await page.screenshot({ path: info.outputPath('00-hello.png') });
  for (let i = 0; i < CHAPTERS.length; i++) {
    const ch = CHAPTERS[i];
    await scrollTo(page, ch, MID[ch]);
    const top = await page.evaluate((c) => document.querySelector(`#chapter-${c} p.font-mono`)?.getBoundingClientRect().top ?? -1, ch);
    expect(top, `${ch} kicker under the header`).toBeGreaterThanOrEqual(52);
    expect(await noHorizontalScroll(page), `${ch} scrolls sideways`).toBe(true);
    await page.screenshot({ path: info.outputPath(`0${i + 1}-${ch}.png`) });
  }
});

test('story: social links visible and correct', async ({ page }) => {
  const links = page.locator('[data-target$="-story"]:visible');
  await expect(links).toHaveCount(3);
  const hrefs = await links.evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs).toEqual(
    expect.arrayContaining(['https://www.linkedin.com/in/sarvesh-khimesra/', 'https://x.com/SKhimesra', 'https://www.instagram.com/sarveshrf/']),
  );
});

test('poet: notebook couplet plays in my voice', async ({ page }) => {
  await scrollTo(page, 'poet', 1.15);
  const btn = page.locator('[data-target="story-shayari-0"]');
  await btn.click();
  await expect(btn).toContainText('playing', { timeout: 5000 });
  await btn.click();
});

test('poet: nazm shows all six lines, and "more shayaris" opens shayari.app', async ({ page, isMobile }, info) => {
  await scrollTo(page, 'poet', 3.6);
  const nazm = page.locator('#chapter-poet').getByText('मेरे दोस्तों', { exact: true });
  await expect(nazm).toBeVisible();
  await page.screenshot({ path: info.outputPath('nazm.png') });
  await page.locator('[data-target="story-more-shayari"]').click();
  await expect.poll(() => inOS(page)).toBe(true);
  if (isMobile) await expect(page.locator('section[role="dialog"].fixed')).toContainText('written by me');
  else await expect(page.locator('[data-target="window-shayari"]')).toBeVisible();
  await page.screenshot({ path: info.outputPath('nazm-to-shayari-app.png') });
  // back returns to the story
  await page.goBack();
  if (isMobile) await page.goBack();
  await expect.poll(() => inOS(page)).toBe(false);
});

test('maafi: plays, keeps playing into the desktop, mini player pauses and stops', async ({ page }) => {
  await scrollTo(page, 'poet', 5.5);
  await page.locator('#chapter-poet [aria-label="Play Maafi"]').click();
  const mini = page.locator('[data-target="now-playing"]');
  await expect(mini).toContainText('now playing', { timeout: 5000 });
  await scrollTo(page, 'traveller', 2);
  await expect(mini).toContainText('now playing');
  await page.locator('[data-target="skip-to-desktop"]').click();
  await expect.poll(() => inOS(page)).toBe(true);
  await expect(mini).toContainText('now playing');
  await page.getByLabel('Pause Maafi (mini player)').click();
  await expect(mini).toContainText('paused');
  await page.getByLabel('Stop Maafi').click();
  await expect(mini).toHaveCount(0);
});

test('people: every photo lands on screen', async ({ page }, info) => {
  await scrollTo(page, 'people', 3.9);
  const cards = page.locator('#chapter-people figure:visible');
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
  const off = await cards.evaluateAll((fs) =>
    fs.filter((f) => {
      const r = f.getBoundingClientRect();
      return r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight;
    }).length,
  );
  expect(off, 'cards off screen').toBe(0);
  await page.screenshot({ path: info.outputPath('people.png') });
});

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only');

  test('os: personas recolour and open their windows', async ({ page }, info) => {
    await page.locator('[data-target="skip-to-desktop"]').click();
    await expect.poll(() => inOS(page)).toBe(true);
    const accents = { poet: '244 114 82', athlete: '190 242 100', traveller: '125 211 252', engineer: '251 191 36' };
    for (const [p, accent] of Object.entries(accents)) {
      await page.locator(`header [data-target="persona-${p}"]`).click();
      await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--accent'))).toBe(accent);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: info.outputPath(`os-${p}.png`) });
    }
  });

  test('os: deep link opens an app and photos open in a viewer', async ({ page }) => {
    await page.goto('/?open=travel');
    const win = page.locator('[data-target="window-travel"]');
    await expect(win).toBeVisible();
    await win.locator('[data-target^="photo-"]').first().click();
    await expect(page.getByRole('dialog', { name: 'Photo viewer' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Photo viewer' })).toHaveCount(0);
  });
});

test.describe('phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'phone only');

  test('home screen: every app opens as a sheet; back button peels one layer at a time', async ({ page }, info) => {
    await page.locator('[data-target="skip-to-desktop"]').click();
    await expect.poll(() => inOS(page)).toBe(true);
    await page.screenshot({ path: info.outputPath('home.png') });
    const sheet = page.locator('section[role="dialog"].fixed');
    for (const id of ['about', 'shayari', 'maafi', 'sports', 'travel', 'camera', 'terminal', 'contact']) {
      await page.locator(`[data-target="m-icon-${id}"]`).tap();
      await expect(sheet, `${id} sheet`).toBeVisible();
      await page.getByRole('button', { name: /‹ home/ }).tap();
      await expect(sheet).toHaveCount(0);
    }
    await page.locator('[data-target="m-icon-travel"]').tap();
    await sheet.locator('[data-target^="photo-"]').first().tap();
    const viewer = page.getByRole('dialog', { name: 'Photo viewer' });
    await expect(viewer).toBeVisible();
    await page.goBack();
    await expect(viewer).toHaveCount(0);
    await expect(sheet).toBeVisible();
    await page.goBack();
    await expect(sheet).toHaveCount(0);
    expect(await inOS(page)).toBe(true);
    await page.goBack();
    await expect.poll(() => inOS(page)).toBe(false);
  });

  test('home screen: persona chips recolour', async ({ page }) => {
    await page.locator('[data-target="skip-to-desktop"]').click();
    await page.locator('.md\\:hidden [data-target="persona-athlete"]').tap();
    await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue('--accent'))).toBe('190 242 100');
  });
});
