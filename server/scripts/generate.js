const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privateKey = secp.utils.randomPrivateKey();

console.log(toHex(privateKey), 'Private Key');

const publicKey = secp.getPublicKey(privateKey);

console.log(toHex(publicKey), 'Public Key');

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log(toHex(address), 'address');

// dummy private keys
// a7a7e288346dcfc8ee803fef239a9fca6c9f027f0f45440bab77a34a885e829c
    //address: 20d3559c5d00b9533c6e133eae13468003afa8e0
// cfd2150a9523cc88ded9b4d2cc31fbce7c10572937df2fc7d3bb30a56aac8886
    //address: e5058a5a6faf49ee8193f27f4ecdd95ea1289bf2
// 534a3bbc746c74a3d20aedf7299c481e047455bdc277b2a3318283665e61b429
    //address: 445fbf6750881c43821d1efbe8c712f088227386