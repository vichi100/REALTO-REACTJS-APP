const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/profile');
    
    // Wait for the elements to load
    await page.waitForSelector('text=Residential Listing Summary');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: '/Users/vichi/.gemini/antigravity/brain/45e52b22-afad-414f-a451-f34378ba3cff/summary_dark_mode_test.webp' });

    await browser.close();
})();
