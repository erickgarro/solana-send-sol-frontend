import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../styles/Home.module.css';
import bs58 from 'bs58';
import * as web3 from '@solana/web3.js'

export const SendSolForm: FC = () => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [txSig, setTxSig] = useState('');
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const link = () => txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : '';

    const sendSol = async (event) => {
        event.preventDefault();

        try {
            const decoded = bs58.decode(recipient);
            if (decoded.length !== 32) {
                alert('Invalid Solana address');
                return;
            }
        } catch (error) {
            alert('Invalid Solana address');
            return;
        }

        const recipientPublicKey = new PublicKey(recipient);
        const lamports = Number(amount) * LAMPORTS_PER_SOL; // Convert SOL to lamports

        const transaction = new web3.Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPublicKey,
                lamports,
            })
        );

        try {
            const signature = await sendTransaction(transaction, connection);
            setTxSig(signature);
            alert('Transaction successful! See on Solana Explorer.');
        } catch (error) {
            console.error('Could not send transaction:', error);
            alert('Transaction failed!');
        }
    };

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" value={amount} onChange={e => setAmount(e.target.value)} className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" value={recipient} onChange={e => setRecipient(e.target.value)} className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
            {txSig && 
                <div>
                    <p>View your transaction on: </p>
                    <a href={link()} target="_blank" rel="noopener noreferrer">Solana Explorer</a>
                </div>
            }
        </div>
    );
};
