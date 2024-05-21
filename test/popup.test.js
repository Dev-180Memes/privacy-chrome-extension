const puppeteer = require('puppeteer');
const path = require('path');

describe('Popup Tests', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Set to false to see the browser actions
      args: [
        `--disable-extensions-except=${path.resolve(__dirname, '../')}`,
        `--load-extension=${path.resolve(__dirname, '../')}`,
      ],
    });

    page = await browser.newPage();
    await page.goto('chrome-extension://<extension-id>/popup/popup.html');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Should load popup with correct title', async () => {
    await page.waitForSelector('h1');
    const title = await page.$eval('h1', (el) => el.textContent);
    expect(title).toBe('Privacy Enhancer');
  });

  test('Should have Block Trackers checkbox', async () => {
    const isCheckboxPresent = await page.$eval('#blockTrackers', (el) => !!el);
    expect(isCheckboxPresent).toBe(true);
  });

  test('Should save settings', async () => {
    await page.click('#blockTrackers');
    await page.click('#saveButton');
    const message = await page.evaluate(() => alert.getMessage());
    expect(message).toBe('Settings saved!');
  });
});
