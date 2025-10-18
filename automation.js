#!/usr/bin/env node
/**
 * add-automation.js
 * Single-file Node.js automation using Puppeteer to open a small webpage, enter two numbers,
 * click an "Add" button, and print the result.
 *
 * Usage:
 *   1. Install dependencies: npm install puppeteer
 *   2. Run: node add-automation.js 12 30
 *
 * If no arguments provided, defaults to 2 and 3.
 */

const puppeteer = require('puppeteer');

(async () => {
  try {
    const a = process.argv[2] ?? '2';
    const b = process.argv[3] ?? '3';

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Adder</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      input { width: 100px; margin-right: 6px; }
      button { padding: 6px 10px; }
      #result { margin-left: 10px; font-weight: bold; }
    </style>
  </head>
  <body>
    <h3>Simple Web Adder</h3>
    <input id="a" type="number" placeholder="a" />
    <input id="b" type="number" placeholder="b" />
    <button id="add">Add</button>
    <span id="result"></span>

    <script>
      document.getElementById('add').addEventListener('click', () => {
        const a = parseFloat(document.getElementById('a').value) || 0;
        const b = parseFloat(document.getElementById('b').value) || 0;
        document.getElementById('result').textContent = a + b;
      });
    </script>
  </body>
</html>`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the in-memory page using a data URL
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    await page.goto(dataUrl, { waitUntil: 'domcontentloaded' });

    // Fill the inputs and click the add button
    await page.focus('#a');
    await page.keyboard.type(String(a));
    await page.focus('#b');
    await page.keyboard.type(String(b));
    await page.click('#add');

    // Read the result from the page
    await page.waitForSelector('#result');
    const result = await page.$eval('#result', el => el.textContent.trim());

    console.log(`${a} + ${b} = ${result}`);

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
