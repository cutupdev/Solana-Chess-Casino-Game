import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainBlockChessNewLayout from "../components/MainBlockChessNewLayout";

const Home: NextPage = () => {
  const [rpc, setRpc] = useState<string | null>(null);
  const { connection } = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    const toastConnected = async () => {
      if (wallet.connected) {
        const cluster = await connection.getClusterNodes();
        if (rpc !== cluster[0].rpc) {
          toast(`Connected to ${cluster[0].rpc}`);
          setRpc(cluster[0].rpc);
        }
      }
    };
    toastConnected();
  }, [wallet, connection, rpc]);

  // TODO: Adding the format RPC to the network
  const formatRpc = rpc !== null ? `Network: ${rpc}` : "";
  return (
/*     <Layout formatRpc={formatRpc}>
      <div className="container mx-auto justify-center">
        <MainBlockChess />
      </div>
    </Layout>
    
 */  
 <MainBlockChessNewLayout />


 );
};

export default Home;
