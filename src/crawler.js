/*
 * @Descripttion: 
 * @version: 
 * @Author: chunwen
 * @Date: 2021-09-19 18:33:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-19 22:14:30
 */
const puppeteer = require("puppeteer");
const { imgs, word } = require("./config/default");
const srcToImg = require("./config/helper/srcToImg");
const browserFetcher = puppeteer.createBrowserFetcher();
const fs = require('fs')

browserFetcher.download("901912").then((res) => {
  (async () => {
    const browser = await puppeteer.launch({
      executablePath: await res.executablePath,
    });
    const page = await browser.newPage();
    await page.goto("https://image.baidu.com/");
    console.log("go to https://image.baidu.com/");

    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    console.log("reset viewport");

    // 触发输入框焦点事件
    await page.focus("#kw");
    // 触发输入框输入文字
    await page.keyboard.sendCharacter("狗");
    // 触发搜索按钮点击
    await page.click(".s_newBtn");
    console.log("go to search list page");
    // 等待搜索结果出来
    page.on("load", async () => {
      console.log("搜索结果出来了");

      const srcs = await page.$$eval("img.main_img", (eles) => {
        return eles.map((item) => {
          return item.src;
        });
      });
      fs.writeFileSync(`${word}/${Date.now()}.txt`, srcs.join("\r\n"), "utf8");
      // const srcs = await page.evaluate(() => {
      //   const images = document.querySelectorAll("img.main_img");
      //   return Array.prototype.map.call(images, (img) => img.src);
      // });
      console.log('srcs', srcs);
      srcs.forEach(async(src) => {
        await page.waitForTimeout(1000).then(() => console.log("Waited a second!"));
        await srcToImg(src, imgs);
      });

      await browser.close()
    });
  })();
})
