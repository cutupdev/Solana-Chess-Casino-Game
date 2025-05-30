// Test the landing page
import React, { useEffect, useState } from "react";
import LayoutLanding from "./LayoutLanding/LayoutLanding";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { TailSpin } from "react-loader-spinner";
import { auth, db } from "../firebase";
import { defaultName } from "../data/parameters";
import { Member } from "../schema/Member";
import { DescriptionGame } from "./DescriptionGame";
import { MyChessPieces } from "./MyChessPieces";
import { GameListTable } from "./GameListTable";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// TODO: Do a huge refactoring of the different components
// TODO: Do a huge refactoring of all the style
const MainBlockChessNewLayout = () => {
  const router = useRouter();

  const [user, _, _error] = useAuthState(auth)

  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);


  /**
   * Create a new game and move to the new screen.
   */
  const startGame = async () => {
    setIsGameLoading(true);
    const member: Member = {
      uid: user?.uid,
      piece: ['b', 'w'][Math.round(Math.random())],
      name: localStorage.getItem('userName') || defaultName,
      creator: true,
      hasBetChessPiece: false
    }

    const dateNow = Date.now();
    const game = {
      status: 'waiting',
      player1: member,
      members: [member],
      gameCreatedAt: dateNow,
      gameId: `${Math.random().toString(36).substr(2, 9)}_${dateNow}`
    }

    await db.collection('games').doc(game.gameId).set(game)
    router.push(`/game/${game.gameId}`)
  }


  /**
   * Sign out of Firebase, mostly used for debugging.
   */
  const handleSignOut = () => {
    auth.signOut();
  }



  return (
    <>
      <LayoutLanding>




        {/* Play Section */}

        <div className="flex flex-col justify-center items-center mb-10 mt-10" id="play">
          <h2 className="title-presentation" style={{ marginTop: '100px' }}>Play Chess</h2>
          <div className="dividerBlue" />
        </div>
        <div className="flex flex-col justify-center items-center">

          <button
            className="cursor-pointer py-2 px-4 rounded text-center bg-square-white text-xl mt-2 disabled:opacity-30"
            onClick={startGame}
          >
            Start a Game
                </button>
          {isGameLoading &&
            <TailSpin color="#00BFFF" height={40} width={40} />
          }

          <div style={{ marginBottom: '20px' }} />

          <MyChessPieces />

          <div style={{ marginBottom: '20px' }} />


          {/* The table of games. */}
          <GameListTable />



        </div>

        <div className="flex flex-col justify-center items-center mt-40" id="concept">
          <h2 className="title-presentation">How to get started</h2>
          <div className="dividerBlue" />

          <DescriptionGame />

        </div>

        <ToastContainer />

      </LayoutLanding>
    </>
  );
}


export default MainBlockChessNewLayout;
