import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface Props {
  children: React.ReactNode | React.ReactNode[];
  network: WalletAdapterNetwork;
  localAddress?: string;
}

const WalletConnectionProvider: FC<Props> = ({
  children,
  localAddress,
  network,
}: Props) => {
  const endpoint = useMemo(() => {
    if (localAddress) {
      return localAddress;
    }
    return clusterApiUrl(network);
  }, [localAddress, network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
    ],
    []
  );

  const onError = (error: WalletError) => {
    // toast(error.message ? `${error.name}: ${error.message}` : error.name);
    console.error(error);
  };
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
