#!/usr/bin/env node

let crypto = require('crypto');
let fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Usage: encrypt <certFile> <plaintext>");
  console.log("Or: encrypt <certFile> -f <plaintextFile>");

  process.exit(-1);
}

let publicKey = fs.readFileSync(process.argv[2]);
let plaintext = process.argv[3] === '-f' ?
  fs.readFileSync(process.argv[4]) :
  process.argv[3]

function encrypt(publicKey, text) {
  const key = crypto.randomBytes(32);
  const iv = Buffer.from(crypto.randomBytes(16));

  const cipher = crypto.createCipheriv('aes256', key, iv);
  let cipherText = cipher.update(text, 'utf8', 'base64');
  //cipherText is the result for ab
  cipherText += cipher.final('base64');

  const result = { cipherText, iv: iv.toString('base64'), key: crypto.publicEncrypt(publicKey, Buffer.from(key)).toString('base64') };

  return Buffer.from(JSON.stringify(result)).toString('base64');
}

console.log('~~~~~~~~ encrypted output ~~~~~~~~');
console.log(encrypt(publicKey, plaintext));
