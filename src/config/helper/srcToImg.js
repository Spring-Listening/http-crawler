/*
 * @Descripttion: 
 * @version: 
 * @Author: chunwen
 * @Date: 2021-09-19 19:05:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-19 21:49:59
 */

const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.write)

module.exports = async(src, dir) => {
  if (src.match(/^data:(.+?);base64,(.+)$/)) {
    console.log('调用了base64ToImg');
    await base64ToImg(src, dir);
  } else {
    console.log("调用了urlToImg");
    await urlToImg(src, dir);
  }
}

// url => image
const urlToImg = promisify((url, dir, callback) => {
  const mod = /^https:/.test(url) ? https : http
  const ext = path.extname(url)
  const file = path.join(dir, `${Date.now()}${ext || '.jpg'}`)
  mod.get(url, res => {
    var imgData = "";
    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
    res.on("data", function(chunk){ //这步是我百度来的。。。。
        imgData+=chunk;
    });
    res.on("end", function(){
        fs.writeFile(file, imgData, "binary", function(err){
            if(err){
                console.log("down fail", err);
            }
            console.log("down success");
        });
    });
  })
})
// base64 => image
const base64ToImg = async(base64Str, dir) => {
  // data:image/jpeg;base64,/dsfljsdlkfjslk
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/)
  try {
    const ext = matches[1].split("/")[1].replace("jpeg", "jpg");
    const file = path(dir, `${Date.now()}.${ext}`);
    await writeFile(file, matches[2], "base64");
    console.log(file);
  } catch (error) {
    console.log(error);
  }
}