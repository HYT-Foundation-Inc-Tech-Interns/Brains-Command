
const { chromium } = require('playwright-core');
const fs = require('fs');
const acct = JSON.parse(fs.readFileSync('/tmp/demo-account.json','utf8'));
const W = 1920, H = 1080;
const outDir = 'demo-video/raw2';
fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--hide-scrollbars','--force-device-scale-factor=1'] });
  const context = await browser.newContext({ viewport:{width:W,height:H}, recordVideo:{ dir: outDir, size:{width:W,height:H} }, deviceScaleFactor:1 });
  const page = await context.newPage();
  const glide = async (x,y,steps=18) => { await page.mouse.move(x,y,{steps}); await sleep(90); };
  const hideDev = async () => { try { await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' }); } catch(e){} };

  try {
    await page.goto('http://localhost:3000/', { waitUntil:'networkidle' });
    await hideDev();
    await sleep(900);
    await glide(960, 470);

    // sign in
    await page.getByRole('button', { name: /^Sign In$/i }).first().click();
    await sleep(700);
    await page.locator('input[name="email"]').click();
    await page.locator('input[name="email"]').type(acct.email, { delay: 12 });
    await page.locator('input[name="password"]').click();
    await page.locator('input[name="password"]').type(acct.password, { delay: 22 });
    await sleep(300);
    await page.getByRole('button', { name: /show password/i }).click();
    await sleep(1300);
    await page.getByRole('button', { name: /hide password/i }).click();
    await sleep(250);
    await page.getByRole('button', { name: /secure sign in/i }).click();
    await page.waitForURL('**/user-dashboard', { timeout: 25000 });
    await hideDev();
    await sleep(2200);

    // overview
    await glide(420, 250);
    await glide(980, 330);
    await sleep(500);

    // HMS
    await page.getByText('Frontdesk (HMS)', { exact: true }).first().click();
    await sleep(1900);
    await glide(760, 480);
    await glide(1180, 600);
    await sleep(600);

    // Billing
    const billing = page.getByText('Billing & Subscription', { exact: true }).first();
    await billing.scrollIntoViewIfNeeded();
    await sleep(300);
    await billing.click();
    await sleep(2000);
    await glide(900, 520);
    for (let i=0;i<3;i++){ await page.mouse.wheel(0, 180); await sleep(180); }
    await sleep(900);

    // Account settings + photo viewer
    await page.locator('button[title="Account Settings"]').nth(1).click();
    await sleep(1500);
    await glide(1480, 540);
    await page.locator('button[title="Click to view and zoom"]').first().click();
    await sleep(900);
    for (let i=0;i<3;i++){ await page.locator('button[title="Zoom in"]').click(); await sleep(450); }
    await sleep(1400);
  } catch (e) {
    console.error('SCRIPT ERROR:', e.message);
  } finally {
    await context.close();
    await browser.close();
  }
  const files = fs.readdirSync(outDir).filter(f=>f.endsWith('.webm')).map(f=>({f,t:fs.statSync(outDir+'/'+f).mtimeMs})).sort((a,b)=>b.t-a.t);
  console.log('VIDEO:', files[0] ? outDir+'/'+files[0].f : 'none');
})();
