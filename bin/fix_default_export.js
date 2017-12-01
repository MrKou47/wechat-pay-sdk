#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const resultPath = path.join(__dirname, '../lib/index.js');

fs.readFile(resultPath, 'utf8', (err, data) => {
  if (err) {
    throw new Error(err);
    return;
  }
  const fileContent = data.replace(/exports\.default\s+=\s+WechatPay/, 'module.exports = WechatPay');
  fs.writeFile(resultPath, fileContent, err => {
    if (err) {
      throw new Error(err);
      return;
    }
    console.log('replace default exports success');
  });
});