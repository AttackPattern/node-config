const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const root = process.cwd();

let precedence = process.env['ConfigurationPrecedence'] || process.env.precedence;
const aspects = [null].concat(precedence ? precedence.split('|') : []);

function tryRequire(module) {
  try {
    return require(module);
  }
  catch (e) { }
}

function getSettings(settings) {
  return aspects.reduce((result, aspect) => ({
    ...result,
    ...tryRequire(path.join(root, '.config', aspect || '', settings))
  }), {});
}

function decrypt(data) {
  const { cipherText, key, iv } = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));

  const decipherKey = crypto.privateDecrypt(fs.readFileSync(path.join(root, '.config/keys/key.pem')), Buffer.from(key, 'base64'));
  const decipher = crypto.createDecipheriv('aes256', decipherKey, Buffer.from(iv, 'base64'));
  let deciphered = decipher.update(cipherText, 'base64', 'utf8');
  deciphered += decipher.final('utf8');

  return deciphered;
}

module.exports = Object.assign(getSettings, {
  decrypt: value => decrypt(value)
});
