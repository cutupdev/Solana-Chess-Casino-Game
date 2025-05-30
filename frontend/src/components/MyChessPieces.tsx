import React from "react";
import {FaChessKnight} from "react-icons/fa";
import {AiFillThunderbolt, AiFillTrophy} from "react-icons/ai";
import Image from "next/image";
import {ChessPiece} from "../schema/ChessPiece";
import {chessPiecesData, chessPiecesDataReverse} from "../data/chessPieces";

/**
 * Function to determine the background color in the list of chess pieces.
 *
 * @param index
 */
export function backgroundBlackOrWhite(index: number) {
    if (index <= 7) {
        return index % 2 === 0;
    } else {
        return index % 2 !== 0;
    }
}

export const MyChessPieces = ({isOpponent = false}) => {

    const defaultChessPieces = isOpponent ? chessPiecesDataReverse : chessPiecesData;
    return (
        <>
            <div className="inline-grid grid-cols-8 grid-rows-2 mt-2 my-chess-pieces">
                {defaultChessPieces.map((chessPiece, index) => (
                        <div key={index} className={`p-1 flex justify-center items-center board-square ${backgroundBlackOrWhite(index)  ? 'square-white' : 'square-black'}`}>
                            <Image src={chessPiece.imageURL} alt="chessPiece" width={70} height={72}/>
                        </div>
                    )
                )}
            </div>
        </>
    )
}
