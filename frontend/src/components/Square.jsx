import React from 'react'

export default function Square({ children, black }) {
  const bgClass = black ? 'square-white' : 'square-black'

  return (
    <div className={`${bgClass} board-square`}>
      {children}
    </div>
  )
}
