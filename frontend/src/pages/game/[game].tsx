import { Layout } from "../../components/Layout";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { gameSubject, initGame } from '../../components/Game';
import Board from '../../components/Board';
import { gameStatusEnum } from "../../schema/enums";
import { MyChessPieces } from "../../components/MyChessPieces";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SharingButton } from "../../components/SharingButton";
import { TailSpin } from "react-loader-spinner";
import { ModalIntruder } from "../../components/ModalIntruder";
import { NUMBER_SECONDS_GAME } from "../../data/parameters";
import { Play2EarnModal, finishGameAndGetMoneyWebThree } from "play2earn";

export default function Game() {

    const router = useRouter();
    const { game } = router.query; // ID of the game
    const [user, loading, error] = useAuthState(auth);

    // Related to game
    const [board, setBoard] = useState([])
    const [isGameOver, setIsGameOver] = useState<boolean>()
    const [result, setResult] = useState()
    const [position, setPosition] = useState();
    const [turn, setTurn] = useState();  // w or b
    const [winner, setWinner] = useState<string>();  // w or b  // TODO: Move to an Enum
    const [initResult, setInitResult] = useState(null);
    const [loadingGame, setLoadingGame] = useState(true);
    const [status, setStatus] = useState('');
    const [mySecondsRemaining, setMySecondsRemaining] = useState<number>(NUMBER_SECONDS_GAME);
    const [opponentSecondsRemaining, setOpponentSecondsRemaining] = useState<number>(NUMBER_SECONDS_GAME);

    // Game information
    const [gameObject, setGameObject] = useState<any>({});
    const gameRefFb = db.doc(`games/${game}`);

    /**
     * Listen to the update of the chessboard gameObject
     */
    useEffect(() => {
        let subscribe: any;

        async function init() {
            const res = await initGame(game !== 'local' ? db.doc(`games/${game}`) : null);
            // @ts-ignore
            setInitResult(res);
            setLoadingGame(false);

            if (!res) {
                subscribe = gameSubject.subscribe((game: any) => {
                    setBoard(game.board)
                    setIsGameOver(game.isGameOver)
                    setResult(game.result)
                    setPosition(game.position);
                    setStatus(game.status);
                    setTurn(game.turn);
                    setWinner(game.winner);
                    setGameObject(game);
                })
            }
        }

        init()
        return () => subscribe && subscribe.unsubscribe()
    }, [game])



    /**
     * Triggered the result function when the game is over and display the signature to the finnal user.
     */
    useEffect(() => {

        async function triggerFinishGame() {
            if (isGameOver && gameObject.member && gameObject.member.piece === winner) {
                console.log('The game has finished and the current player is the winner.');
                const winnerUsername: string = gameObject.member.name;

                // TODO: winnerPublicKey should be optional

                // @ts-ignore
                finishGameAndGetMoneyWebThree(process.env.NEXT_PUBLIC_WEBSITE_HOST, game, winnerUsername, winnerUsername, false)
                    .then(resultSignature => {
                        console.log('The money has been transferred to your account, the signature is: ', resultSignature);
                    });
            }
        }

        triggerFinishGame();

    }, [isGameOver, gameObject, winner])


    /**
     * Used to update the firebase game status when the second player has accept the betting.
     * The game can start.
     **/
    async function handleGameStarting() {
        console.log('Updating when the second player has accepted the bet.');
        await db.doc(`games/${game}`).update({
            status: 'ready', whiteStartingTime: Date.now(),
            blackStartingTime: Date.now(), blackSecondsRemaining: NUMBER_SECONDS_GAME, whiteSecondsRemaining: NUMBER_SECONDS_GAME
        });
    }


    /**
     * Update the timer for both sides. For the opponent and the current user.
     * 
     */
    useEffect(() => {
        // TODO: Possible to make it better
        if (gameStatusEnum.Ready === status) {
            const intervalId = setInterval(async () => {
                const gameFb = await gameRefFb.get().then((doc: any) => doc.data());
                let timeInSeconds: number;
                let colorPiece: string;

                // White turn
                if (turn === 'w') {
                    timeInSeconds = Math.round(Math.max(0, Date.now() - gameFb.whiteStartingTime) / 1000);
                    colorPiece = 'white';
                } else {
                    timeInSeconds = Math.round(Math.max(0, Date.now() - gameFb.blackStartingTime) / 1000);
                    colorPiece = 'black';
                }

                if (gameObject.member && turn === gameObject.member.piece) {
                    setMySecondsRemaining(Math.max(0, gameFb[`${colorPiece}SecondsRemaining`] - timeInSeconds));
                } else {
                    setOpponentSecondsRemaining(Math.max(0, gameFb[`${colorPiece}SecondsRemaining`] - timeInSeconds));
                }

            }, 1000)


            return () => clearInterval(intervalId);
        }

    }, [gameObject.member, gameRefFb, status, turn])


    /**
     * Update the status when the seconds of the opponents reach 0.
     */
    useEffect(() => {
        async function updateStatusGameWhenCountdownZero() {
            await gameRefFb.update({ status: gameStatusEnum.Finished, winner: gameObject.member.piece });
        }
        // TODO: Not possible to update the game when finished
        if (gameStatusEnum.Ready === status && opponentSecondsRemaining <= 0 && gameObject.member) {
            updateStatusGameWhenCountdownZero();
            setWinner(gameObject.member.piece);
            setIsGameOver(true);
            console.log('Winner by Chrono: ', gameObject.member.piece);
        }
    }, [gameObject.member, gameRefFb, opponentSecondsRemaining, status])


    // Display spinning while waiting for the game to load
    if (loadingGame) {
        return (
            <Layout>
                <div className="flex place-content-center w-full h-full'">
                    <TailSpin color="#00BFFF" height={80} width={80} />
                </div>
            </Layout>
        )
    }

    if (initResult === 'notfound') {
        return (
            <Layout>
                <ModalIntruder textMessage={'Unfortunately game not found...'} />
            </Layout>

        )
    }

    if (initResult === 'intruder') {
        return (
            <Layout>
                <ModalIntruder textMessage={'The game is already full...'} />
            </Layout>
        )
    }

    /**
     * Display the button and modal based on the game result.
     * 
     * @param gameResultIndicator: string (w // b // n) n is for draw
     * @param gameResultMessage: string result message associated, useful in case of draw.
     */
    const displayResultMessage = (gameResultIndicator: string, gameResultMessage: string) => {
        if (gameResultIndicator === 'n') {
            return (
                <>
                    <div
                        className="border-4 border-yellow-700 rounded-xl p-4 flex flex-col justify-center items-center"
                        style={{ marginTop: '50px' }}>
                        {gameResultMessage}. Both player get back their betting!
                    </div>
                </>
            )
        } else {
            const color = gameResultIndicator === 'w' ? 'White' : 'Black'
            return (
                <div
                    className="border-4 border-yellow-700 rounded-xl p-4 flex flex-col justify-center items-center"
                    style={{ marginTop: '50px' }}>
                    {color} have won
                </div>
            )
        }
    }



    // @ts-ignore
    return (
        <Layout>


            {/*The game is started*/}
            {(status === gameStatusEnum.Ready || status === gameStatusEnum.Finished) &&

                <div className="app-container">
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', color: "white", backgroundColor: "#374151", borderRadius: '10px', width: '250px', height: '60px',
                            marginBottom: 'auto', fontSize: '18px', marginRight: '20px'
                        }}>
                            {opponentSecondsRemaining} seconds remaining

                            </div>
                        <div className="board-container">

                            {gameObject.opponent && gameObject.opponent.name &&
                                <span className="text-red-700 font-bold">{gameObject.opponent.name}</span>}
                            <Board board={board} position={position} mySecondsRemaining={mySecondsRemaining} />
                            {gameObject.member && gameObject.member.name &&
                                <p className="text-blue-700 font-bold">{gameObject.member.name}</p>}
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center', color: "white", backgroundColor: "#374151", borderRadius: '10px', width: '250px', height: '60px',
                            marginTop: 'auto', fontSize: '18px', marginLeft: '20px'
                        }}>
                            {mySecondsRemaining} seconds remaining

                            </div>
                    </div>

                    {/* Game finished */}
                    {isGameOver && winner &&
                        displayResultMessage(winner, gameObject.result)
                    }

                    {/* Winner side */}
                    {isGameOver && gameObject.member && gameObject.member.piece === winner && (
                        <button
                            className="cursor-pointer mt-2 py-2 px-4 rounded transition text-center text-purple-50 bg-green-600 disabled:opacity-30"
                        >
                            Pop Up !
                        </button>
                    )}

                </div>
            }

            <div className="flex flex-col justify-center items-center">

                {/* The person is waiting alone */}
                {status === 'waiting' && (
                    <SharingButton shareableLink={window.location.href} />
                )}

                {/*Chess Pieces of the opponent.*/}
                {status !== 'ready' && status !== 'waiting' && status !== gameStatusEnum.Finished && (
                    <div style={{ marginTop: '10px' }}>
                        <MyChessPieces isOpponent={true} />
                    </div>
                )}

                {/*Screen about the betting of the chess pieces.*/}
                {status === gameStatusEnum.TwoPlayersPresent && (
                    <>
                        <Play2EarnModal gameWebsiteHost={process.env.NEXT_PUBLIC_WEBSITE_HOST || 'my-website-test.com'} 
                                        gameID={game}
                                        playerUID={user?.uid} 
                                        handleGameStarting={() => handleGameStarting()}
                                        secondsBeforeCancellation={60} />
                    </>
                )}

                {/*My Chess Pieces, show only when the game is not started*/}
                {status !== gameStatusEnum.Ready && status !== gameStatusEnum.Finished && (
                    <MyChessPieces />
                )}

            </div>
            <ToastContainer />
        </Layout>
    );
}
