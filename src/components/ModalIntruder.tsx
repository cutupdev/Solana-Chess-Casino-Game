import React from "react";
import Link from "next/link";

interface IProps {
    textMessage: string;
}

/**
 * Modal intruder based on the status of the game.
 * @param textMessage: string
 * @constructor
 */
export const ModalIntruder = ({textMessage}: IProps) => {

    return (
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col justify-center items-center border-4 border-yellow-700 rounded-xl p-10">
                <h1>{textMessage}</h1>
                <Link href="/" passHref>
                    <a>
                        <button
                            className="cursor-pointer py-2 px-4 rounded transition text-center text-purple-50 bg-yellow-700 disabled:opacity-30"
                        >Back to Home</button>
                    </a>
                </Link>
            </div>
        </div>
    )
}
