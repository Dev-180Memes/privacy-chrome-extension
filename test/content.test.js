const puppeteer = require('puppeteer');

describe('Content Script Tests', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    await page.goto('https://www.example.com'); // Use a test page
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Should remove ads and trackers', async () => {
    await page.addScriptTag({ path: '../content/content.js' });
    // Check if elements are removed
    const ads = await page.evaluate(() => document.querySelectorAll('div[class*="ad"]').length);
    expect(ads).toBe(0);
  });

  test('Should block inline tracking scripts', async () => {
    await page.addScriptTag({ path: '../content/content.js' });
    // Check if scripts are blocked
    const trackers = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script');
      return Array.from(scripts).filter(script => script.src.includes('google-analytics.com')).length;
    });
    expect(trackers).toBe(0);
  });
});
