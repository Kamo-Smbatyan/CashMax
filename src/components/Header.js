import React from "react";
import Button from "./Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
function Header() {
  const {setVisible} = useWalletModal();
  const {connected, publicKey, disconnect} = useWallet();
  const handleConnectWallet = ()=>{
    if (connected) {
      disconnect();
    }
    else{
      setVisible(true);
    }
  }
  return (
    <header className="w-full justify-end py-8 hidden lg:flex px-24">
      <Button title={connected ? truncatePublicKey(publicKey) : "Connect Wallet"} onClick = {handleConnectWallet} >
      </Button>
    </header>
  );
  
}

const truncatePublicKey = (key) => {
  if (!key) return "Connect Wallet";
  return `${key.toString().slice(0, 6)}...`; // Truncate the public key to first 6 characters
};

export default Header;