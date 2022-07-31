import dynamic from "next/dynamic";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LoadingProvider } from "../contexts/LoadingContext";
import { ModalProvider } from "../contexts/ModalContext";
import React from "react";
import { Seo } from "../components/Seo";
import '../styles.css';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {RouteGuard} from "../contexts/RouteGuarding";

const WalletConnectionProvider = dynamic(() => import("../components/Wallet"), {
  ssr: false,
});

const network = () => {
  switch (process.env.NEXT_PUBLIC_BUILD_ENV) {
    case "dev":
      return WalletAdapterNetwork.Devnet;
    case "prod":
      return WalletAdapterNetwork.Mainnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
};

function Chess2EarnApp({ Component, pageProps }: AppProps) {
  const localAddress = process.env.NEXT_PUBLIC_LOCAL_ADDRESS;
  return (
    <>
      <Seo
        imgHeight={508}
        imgUrl="/chess.png"
        imgWidth={1110}
        path="https://www.chess2earn.com"
        title="Chess2Earn"
        pageDescription="BlockChess - The first blockchain game on Solana blockchain"
      />
      <DndProvider backend={HTML5Backend}>
        <LoadingProvider>
          <ModalProvider>
              <WalletConnectionProvider
                network={network()}
                localAddress={localAddress}
              >
                  <RouteGuard>
                    <Component {...pageProps} />
                  </RouteGuard>
              </WalletConnectionProvider>
          </ModalProvider>
        </LoadingProvider>
      </DndProvider>
    </>
  );
}
export default Chess2EarnApp;
