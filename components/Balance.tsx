import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';

export const Balance: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        async function fetchBalance() {
          if (!connection || !publicKey) {
            return;
          }
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        }
        fetchBalance();
      }, [connection, publicKey]);

    return (
        <>
            <p>Balance: {balance} SOL</p>
        </>
    )

};