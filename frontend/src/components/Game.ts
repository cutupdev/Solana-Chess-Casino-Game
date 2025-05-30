import React, { useState } from "react";
import { BehaviorSubject } from 'rxjs';
import {map} from 'rxjs/operators';
import {auth} from '../firebase';
import {fromDocRef} from 'rxfire/firestore';
// @ts-ignore
import * as ChessJS from 'chess.js';
import {gameStatusEnum} from "../schema/enums";
import {Member} from "../schema/Member";
import {defaultName, NUMBER_SECONDS_GAME} from "../data/parameters";
import firebase from "firebase";

let gameRef: any;
let member: any;

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

const chess = new Chess();


export let gameSubject: any;

export async function initGame(gameRefFb: any) {

    const {currentUser} = auth
    if (gameRefFb) {
        gameRef = gameRefFb;
        const initialGame = await gameRefFb.get().then((doc: any) => doc.data());
        if (!initialGame) {
            return 'notfound';
        }
        const creator = initialGame.members.find((m: any) => m.creator);

        if (initialGame.status === gameStatusEnum.Waiting && creator.uid !== currentUser?.uid) {
            const currUser: Member = {
                uid: currentUser?.uid,
                name: localStorage.getItem('userName') || defaultName,
                piece: creator.piece === 'w' ? 'b' : 'w',
                creator: false,
                hasBetChessPiece: false
            };
            const updatedMembers = [...initialGame.members, currUser];
            await gameRefFb.update({members: updatedMembers, status: 'twoPlayersPresent', player2: currUser});
        } else if (!initialGame.members.map((m: { uid: any; }) => m.uid).includes(currentUser?.uid)) {
            // A third person arrived
            return 'intruder';
        }
        chess.reset();

        gameSubject = fromDocRef(gameRefFb).pipe(
            map(gameDoc => {
                const game = gameDoc.data();
                // @ts-ignore
                const {pendingPromotion, gameData, status, ...restOfGame} = game;
                // member = game?.members.find((m: { uid: string | undefined; }) => m.uid === currentUser?.uid);
                // const opponent = game?.members.find((m: any) => m.uid !== currentUser?.uid);

                member = game?.player1.uid === currentUser?.uid ? game?.player1 : game?.player2;
                const opponent = game?.player1.uid !== currentUser?.uid ? game?.player1 : game?.player2;

                if (gameData) {
                    chess.load(gameData);
                }

                // Check if the game is over (Status and chess position over)
                let isGameOver = false;
                if (status === gameStatusEnum.Finished) {
                    isGameOver = true; 
                } else {
                    isGameOver = chess.game_over();
                }

                return {
                    board: chess.board(),
                    turn: chess.turn(),  // The turn in the game
                    pendingPromotion,
                    isGameOver,
                    position: member.piece,
                    member,
                    opponent,
                    result: isGameOver ? getGameResult().message : null,  // It is the message
                    winner: isGameOver ? getGameResult().winner : null,  // It is the w / b / n (null)
                    status,
                    ...restOfGame
                }
            })
        );

    } else {
        // Local Game
        gameRefFb = null;
        // @ts-ignore
        gameSubject = new BehaviorSubject();
        const savedGame = localStorage.getItem('savedGame')
        if (savedGame) {
            chess.load(savedGame)
        }
        updateGame(NUMBER_SECONDS_GAME)
    }
}

/**
 * Reset the game.
 */
export async function resetGame() {
    if (gameRef) {
        await updateGame(NUMBER_SECONDS_GAME, true);
        chess.reset()
    } else {
        chess.reset()
        updateGame(NUMBER_SECONDS_GAME)
    }
}

/**
 * Function which is used to handle the move with the remaining time.
 *
 * @param from
 * @param to
 * @param mySecondsRemaining
 */
export function handleMove(from: any, to: any, mySecondsRemaining: number) {
    const promotions = chess.moves({ verbose: true }).filter((m: { promotion: any; }) => m.promotion)
    let pendingPromotion;
    if (promotions.some((p: { from: any; to: any; }) => `${p.from}:${p.to}` === `${from}:${to}`)) {
        pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(mySecondsRemaining, pendingPromotion)
    }

    if (!pendingPromotion) {
        move(from, to, mySecondsRemaining)
    }
}


export function move(from: any, to: any, mySecondsRemaining: number, promotion?: string | undefined) {
    let tempMove: any = { from, to }
    if (promotion) {
        tempMove.promotion = promotion
    }
    if (gameRef) {
        if (member.piece === chess.turn()) {
            const legalMove = chess.move(tempMove);
            if (legalMove) {
                updateGame(mySecondsRemaining)
            }
        }
    } else {
        const legalMove = chess.move(tempMove)

        if (legalMove) {
            updateGame(mySecondsRemaining)
        }
    }
}

async function updateGame(mySecondsRemaining: number, pendingPromotion?: any, reset?: any) {
    const isGameOver = chess.game_over();

    if (gameRef) {
        const updatedData: any = {gameData: chess.fen(), pendingPromotion: pendingPromotion || null};
        // Warning, this is after moving so the remainingSeconds should be the one of the other color
        if (chess.turn() === 'b') {
            updatedData.whiteSecondsRemaining = mySecondsRemaining;
            updatedData.blackStartingTime = Date.now();
        } else {
            updatedData.blackSecondsRemaining = mySecondsRemaining;
            updatedData.whiteStartingTime = Date.now();
        }
        if (reset) {
            updatedData.status = 'over';
        }
        await gameRef.update(updatedData);
    } else {
        const newGame = {
            board: chess.board(),
            turn: chess.turn(),
            pendingPromotion,
            isGameOver,
            position: chess.turn(),
            result: isGameOver ? getGameResult().message : null,
            winner: isGameOver ? getGameResult().winner : null
        }
        localStorage.setItem('savedGame', chess.fen())
        gameSubject.next(newGame)
    }
}

/**
 * Get the game results as a message and the winner.
 */
function getGameResult() {
    if (chess.in_checkmate()) {
        const winnerPiece: string = chess.turn() === "w" ? "b" : "w";
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return {message: `CHECKMATE - WINNER - ${winner}`, winner: winnerPiece};
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return {message: `DRAW - ${reason}`, winner: 'n'} // None
    } else {
        return {message: "UNKNOWN REASON", winner: 'n'}
    }
}
