import { useState } from 'react';
import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { sha256 } from 'ethereum-cryptography/sha256';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function Transfer({ setBalance, privateKey, publicKey }) {
	const [sendAmount, setSendAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [loading, setLoading] = useState(false);

	const setValue = (setter) => (evt) => setter(evt.target.value);

	async function transfer(evt) {
		evt.preventDefault();
		setLoading(true);
		const payload = {
			sender: publicKey,
			amount: parseInt(sendAmount),
			recipient,
		};

		const payloadHash = toHex(sha256(utf8ToBytes(JSON.stringify(payload))));

		const signature = await secp.sign(payloadHash, privateKey);

		try {
			const {
				data: { balance },
			} = await server.post(`send`, {
				payload,
				payloadHash,
				signature: toHex(signature),
			});
			setBalance(balance);
			setLoading(false);
		} catch (ex) {
      setLoading(false);
			alert(ex.response.data.message);
		}
	}

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input placeholder="1, 2, 3..." value={sendAmount} onChange={setValue(setSendAmount)}></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<input type="submit" className="button" value={loading ? 'sending...' : 'Transfer'} />
		</form>
	);
}

export default Transfer;
