import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import Image from "next/image";


interface IProps {
    piece: any;
    position: string;
}

export default function Piece({
  piece: { type, color },
  position,
}: IProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: 'piece',
      id: `${position}_${type}_${color}`,
    },
    collect: (monitor) => {
      return { isDragging: monitor.isDragging() }
    },
  })

  // TODO: Find a way to incorporate this one
  // const pieceImg = require(`./assets/${type}_${color}.png`)
  return (
    <>
      {/*<DragPreviewImage connect={preview} src={pieceImg} />*/}
      <div
        className="piece-container"
        ref={drag}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
          <Image src={`/${type}_${color}.png`} alt="chessPiece" width={60} height={60}
                 className="piece"/>
      </div>
    </>
  )
}
