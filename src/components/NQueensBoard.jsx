import React from 'react'

const NQueensBoard = ({ board, rows, cols, showAttacked, onSquareClick }) => {
  return (
    <div
      className="grid gap-1 bg-gray-800 p-2 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--square-size))`,
        gridTemplateRows: `repeat(${rows}, var(--square-size))`,
      }}
    >
      {board.map((row, i) =>
        row.map((square, j) => (
          <button
            key={`${i}-${j}`}
            className={`
              flex items-center justify-center rounded
              ${(i + j) % 2 === 0 ? 'bg-white' : 'bg-gray-400'}
              ${square.hasQueen ? 'text-4xl' : ''}
              ${showAttacked && square.isAttacked && !square.hasQueen ? 'bg-red-400' : ''}
              ${square.isAttacked && !square.hasQueen ? 'cursor-not-allowed' : 'hover:opacity-80'}
            `}
            style={{
              fontSize: `calc(var(--square-size) * 0.6)`, // Font size scales proportionally to square size
            }}
            onClick={() => onSquareClick(i, j)}
          >
            {square.hasQueen && '♛'}
          </button>
        ))
      )}
    </div>
  )
}

export default NQueensBoard
