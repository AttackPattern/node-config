#!/usr/bin/env node

let crypto = require('crypto');
let fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Usage: decrypt <keyFile> <cyphertext>");
  process.exit(-1);
}

let privateKey = fs.readFileSync(process.argv[2]);
let data = process.argv[3];

function decrypt(privateKey, data) {
  const { cipherText, key, iv } = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

  const decipherKey = crypto.privateDecrypt(privateKey, Buffer.from(key, 'base64'));
  const decipher = crypto.createDecipheriv('aes256', decipherKey, Buffer.from(iv, 'base64'));
  let deciphered = decipher.update(cipherText, 'base64', 'utf8');
  deciphered += decipher.final('utf8');

  return deciphered;
}

console.log('~~~~~~~~ decrypted plaintext output ~~~~~~~~');
console.log(decrypt(privateKey, data));
