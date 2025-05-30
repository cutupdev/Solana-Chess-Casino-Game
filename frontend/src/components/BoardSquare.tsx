import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { handleMove } from './Game'
import { gameSubject } from './Game'
import Promote from './Promote'


interface IProps {
  piece: string;
  black: boolean;
  position: string;
  mySecondsRemaining: number;
}
/**
 * The board square object.
 *
 * @param piece
 * @param black
 * @param position
 * @param mySecondsRemaining
 * @returns {JSX.Element}
 * @constructor
 */
export default function BoardSquare({
  piece,
  black,
  position,
  mySecondsRemaining
}: IProps) {
  const [promotion, setPromotion] = useState(null)
  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item: any) => {
      const [fromPosition] = item.id.split('_')
      handleMove(fromPosition, position, mySecondsRemaining)
    },
  })
  useEffect(() => {
    const subscribe = gameSubject?.subscribe(
      ({ pendingPromotion }: any) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe()
  }, [position])
  return (
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
  )
}
