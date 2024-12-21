import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Waitlist from "./pages/Waitlist";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
const network = WalletAdapterNetwork.Devnet; // Change to Mainnet for production
const wallets = [
  new PhantomWalletAdapter(), new SolflareWalletAdapter()
];

root.render(
  <React.StrictMode>
    <ConnectionProvider endpoint={`https://api.${network}.solana.com`}>
      <WalletProvider wallets = {wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Waitlist />} />
            </Routes>
            <ToastContainer
              position = "bottom-right"
              autoClose = {2000}
            />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
