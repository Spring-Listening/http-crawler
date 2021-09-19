/*
 * @Descripttion: 
 * @version: 
 * @Author: chunwen
 * @Date: 2021-09-19 14:14:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-19 19:09:43
 */
const puppeteer = require("puppeteer");
const browserFetcher = puppeteer.createBrowserFetcher();
const { screenshot } = require("./config/default");

browserFetcher.download("901912").then((res) => {
  const httpSer = async () => {
    const browser = await puppeteer.launch({
      executablePath: await res.executablePath,
      headless: true,
      defaultViewport: { width: 200, height: 1080 },
    });
    const page = await browser.newPage();
    await page.goto("https://www.npmjs.com");
    await page.screenshot({ path: `${screenshot}/${Date.now()}.png` });
    await browser.close();
  };

  httpSer();
})
