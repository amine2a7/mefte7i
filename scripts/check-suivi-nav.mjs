import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 200 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.screenshot({ path: "scripts/screenshots/header-fr.png" });
await page.goto("http://localhost:3000/incident", { waitUntil: "networkidle" });
await page.screenshot({ path: "scripts/screenshots/header-simple.png" });
await browser.close();
