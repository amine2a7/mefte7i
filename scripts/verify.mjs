import { chromium } from "playwright";
import fs from "node:fs";

const SHOT_DIR = "scripts/screenshots";
fs.mkdirSync(SHOT_DIR, { recursive: true });

const errors = [];

async function withPage(browser, viewport, fn) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
  await fn(page);
  await context.close();
}

async function login(page, email, password) {
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

const browser = await chromium.launch({ channel: "chromium" });

// 1. Landing page - desktop + mobile
await withPage(browser, { width: 1440, height: 900 }, async (page) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${SHOT_DIR}/01-landing-desktop.png`, fullPage: true });
});
await withPage(browser, { width: 390, height: 844 }, async (page) => {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.screenshot({ path: `${SHOT_DIR}/02-landing-mobile.png`, fullPage: true });
});

// 2. Admin dashboard
await withPage(browser, { width: 1440, height: 900 }, async (page) => {
  await login(page, "admin@securekey.fr", "password123");
  await page.waitForSelector("text=Tableau de bord admin");
  await page.screenshot({ path: `${SHOT_DIR}/03-admin-dashboard.png`, fullPage: true });
  await page.click('button:has-text("Transactions")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOT_DIR}/04-admin-transactions.png`, fullPage: true });
  await page.click('button:has-text("Agents")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOT_DIR}/05-admin-agents.png`, fullPage: true });
});

// 3. Agent dashboard
await withPage(browser, { width: 1440, height: 900 }, async (page) => {
  await login(page, "karim.agent@securekey.fr", "password123");
  await page.waitForSelector("text=Tableau de bord agent");
  await page.screenshot({ path: `${SHOT_DIR}/06-agent-dashboard.png`, fullPage: true });
  const firstRow = page.locator("tbody tr").first();
  await firstRow.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOT_DIR}/07-agent-detail-sheet.png`, fullPage: true });
});

// 4. Public incident/commande forms - no login needed - mobile focus
await withPage(browser, { width: 390, height: 844 }, async (page) => {
  await page.goto("http://localhost:3000/incident", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Déclarer un incident");
  await page.screenshot({ path: `${SHOT_DIR}/08-incident-form-mobile.png`, fullPage: true });

  await page.goto("http://localhost:3000/commande", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Commander une clé");
  await page.screenshot({ path: `${SHOT_DIR}/09-commande-form-mobile.png`, fullPage: true });
});

await browser.close();

console.log("\n--- CONSOLE/PAGE ERRORS ---");
if (errors.length === 0) console.log("none");
else errors.forEach((e) => console.log(e));

console.log("\nScreenshots written to", SHOT_DIR);
