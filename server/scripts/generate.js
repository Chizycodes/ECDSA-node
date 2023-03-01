const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privateKey = secp.utils.randomPrivateKey();

console.log(toHex(privateKey), 'Private Key');

const publicKey = secp.getPublicKey(privateKey);

// console.log(toHex(publicKey), 'Public Key');

const address = keccak256(publicKey.slice(1)).slice(-20);
console.log(toHex(address), 'address');

// dummy private keys
// 302b37e651b39ff0458f91e6c20c820f3f32faeba47c074426dc23b083db2989
// 4cc6170c6254fcc3759f4994d768e0fa13fc96453182fb8e6a54a62d77f5fb0c
// d7f63d2fe1001adcf956ee269a0b5ea67f5d9e3209a4e30f41b3ed4f5d9d1559