import React from "react";
import {FaChessKnight} from "react-icons/fa";
import {AiFillThunderbolt, AiFillTrophy} from "react-icons/ai";

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

export const DescriptionGame = () => {

    return (
        <>

            {/* Explanation Card Container */}
            <div className="bg-square-white p-10 rounded-xl mt-2">
                <div className="sm:flex space-x-4">
                    <div className="flex flex-col justify-center items-center rounded-md text-black py-3 px-6 w-80">
                        <FaChessKnight size={50}/>
                        <p className="text-center text-base md:text-xl mb-1 font-semibold ">1. Start a game and share it</p><p
                        className="text-center text-base md:text-lg font-thin">To start playing Chess2Earn, create a new game and invite an opponent. </p></div>
                    <div className="flex flex-col justify-center items-center rounded-md text-black py-3 px-6 w-80">
                        <AiFillThunderbolt size={50}/>
                        <p className="text-center text-base md:text-xl mb-1 font-semibold ">2. Bet some Solana</p><p
                        className="text-center text-base md:text-lg font-thin">Start a game against another player.
                        Before playing, both of you need to bet.</p></div>
                    <div className="flex flex-col justify-center items-center rounded-md text-black py-3 px-6 w-80">
                        <AiFillTrophy size={50}/>
                        <p className="text-center text-base md:text-xl mb-1 font-semibold ">3. The winner takes it
                            all</p><p
                        className="text-center text-base md:text-lg font-thin">The winner get the Solana bet.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
