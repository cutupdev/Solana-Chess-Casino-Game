import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'


interface IProps {
  board: any;
  position: any;
  mySecondsRemaining: number;
}

/**
 * The board game object.
 *
 * @param board
 * @param position
 * @param mySecondsRemaining: the remaining seconds to lose of the player.
 * @returns {JSX.Element}
 * @constructor
 */
export default function Board({ board, position, mySecondsRemaining }: IProps) {
  const [currBoard, setCurrBoard] = useState([])

  useEffect(() => {
    setCurrBoard(
      position === 'w' ? board.flat() : board.flat().reverse()
    )
  }, [board, position])

  function getXYPosition(i: number) {
    const x = position === 'w' ? i % 8 : Math.abs((i % 8) - 7)
    const y =
      position === 'w'
        ? Math.abs(Math.floor(i / 8) - 7)
        : Math.floor(i / 8)
    return { x, y }
  }

  function isBlack(i: number) {
    const { x, y } = getXYPosition(i)
    return (x + y) % 2 === 1
  }

  function getPosition(i: number) {
    const { x, y } = getXYPosition(i)
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][
      x
    ]
    return `${letter}${y + 1}`
  }
  return (
    <div className="board">
      {currBoard.map((piece, i) => (
        <div key={i} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)}
            mySecondsRemaining={mySecondsRemaining}
          />
        </div>
      ))}
    </div>
  )
}
