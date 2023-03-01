const express = require('express');
const app = express();
const cors = require('cors');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
	'042e2695fb432e1cb24c2f555e89ee2e704fe41e18bd61a465a30faffdcfefb27ef438db8863a790aa4bb7063fb05be0f36d882fe0550fe9bc4d7ec04a5486d651': 100,
	'04ea263579fe5e33405500606ece76516b9d6264a822cb46b5b9a056e4b52b71232cea36ea99cccd64d884e7acac56e75f2bfdd96dd7a72c50cc14be1f9aa519ba': 50,
	'0473abf2fa2142d35a9d97629b8a5e486e7950a073e6550378e82cee97aae48187582b504c7df782926f15a843285e4271ae3f2df6909851e61326cf91fd95dd07': 75,
};

app.get('/balance/:address', (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post('/send', (req, res) => {
	const { payload, payloadHash, signature } = req.body;
	const { sender, recipient, amount } = payload;

	// Verify the signature
	const isSigned = secp.verify(signature, payloadHash, sender);
	console.log(isSigned, 'isSigned');
	if (!isSigned) {
		res.status(400).send({ message: 'Invalid signature!' });
		return;
	}
	setInitialBalance(sender);
	setInitialBalance(recipient);

	if (balances[sender] < amount) {
		res.status(400).send({ message: 'Not enough funds!' });
	} else {
		balances[sender] -= amount;
		balances[recipient] += amount;
		res.send({ balance: balances[sender] });
	}
});

// app.post('/send', (req, res) => {
// 	const { sender, recipient, amount } = req.body;

// 	setInitialBalance(sender);
// 	setInitialBalance(recipient);

// 	if (balances[sender] < amount) {
// 		res.status(400).send({ message: 'Not enough funds!' });
// 	} else {
// 		balances[sender] -= amount;
// 		balances[recipient] += amount;
// 		res.send({ balance: balances[sender] });
// 	}
// });

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
