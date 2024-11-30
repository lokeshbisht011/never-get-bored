"use client";

import React, { useState, useEffect } from "react";

import confetti from "canvas-confetti";
import NQueensControls from "./NQueensControls";
import { useToast } from "@/hooks/use-toast";
import NQueensBoard from "./NQueensBoard";

const MIN_SIZE = 4;
const MAX_SIZE = 12;

export default function NQueensProblem() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [board, setBoard] = useState([]);
  const [showAttacked, setShowAttacked] = useState(true);
  const [queenCount, setQueenCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    resetBoard();
  }, [rows, cols]);

  const resetBoard = () => {
    const newBoard = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({ hasQueen: false, isAttacked: false }))
      );
    setBoard(newBoard);
    setQueenCount(0);
  };

  const updateAttackedSquares = (newBoard) => {
    // Create a fresh board with no attacked squares
    const attackedBoard = newBoard.map((row) =>
      row.map(() => ({ hasQueen: false, isAttacked: false }))
    );

    // Traverse the board to find all queens
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j].hasQueen) {
          // Place the queen back on the new board
          attackedBoard[i][j].hasQueen = true;

          // Mark horizontal and vertical lines
          for (let k = 0; k < newBoard.length; k++) {
            attackedBoard[k][j].isAttacked = true; // Vertical
            attackedBoard[i][k].isAttacked = true; // Horizontal
          }

          // Mark diagonals
          for (
            let k = 1;
            k < Math.max(newBoard.length, newBoard[i].length);
            k++
          ) {
            if (i + k < newBoard.length && j + k < newBoard[i].length) {
              attackedBoard[i + k][j + k].isAttacked = true;
            }
            if (i - k >= 0 && j - k >= 0) {
              attackedBoard[i - k][j - k].isAttacked = true; // Top-left diagonal
            }
            if (i + k < newBoard.length && j - k >= 0) {
              attackedBoard[i + k][j - k].isAttacked = true; // Bottom-left diagonal
            }
            if (i - k >= 0 && j + k < newBoard[i].length) {
              attackedBoard[i - k][j + k].isAttacked = true; // Top-right diagonal
            }
          }
        }
      }
    }

    return attackedBoard;
  };

  const handleSquareClick = (row, col) => {
    if (board[row][col].isAttacked && !board[row][col].hasQueen) return;

    const newBoard = board.map((r) => r.map((square) => ({ ...square })));
    newBoard[row][col].hasQueen = !newBoard[row][col].hasQueen;

    const updatedBoard = updateAttackedSquares(newBoard);
    setBoard(updatedBoard);

    const newQueenCount = newBoard[row][col].hasQueen
      ? queenCount + 1
      : queenCount - 1;
    setQueenCount(newQueenCount);

    if (newQueenCount === rows && isBoardSolved(updatedBoard)) {
      celebrateSolution();
    }
  };

  const isBoardSolved = (board) => {
    return board.every((row) => row.some((square) => square.hasQueen));
  };

  const celebrateSolution = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    toast({
      title: "Congratulations!",
      description: "You've solved the N-Queen problem!",
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">N-Queens Problem</h1>

      <NQueensControls
        rows={rows}
        cols={cols}
        setRows={setRows}
        setCols={setCols}
        resetBoard={resetBoard}
        setSquareGrid={() => setRows(Math.max(rows, cols))}
        showAttacked={showAttacked}
        setShowAttacked={setShowAttacked}
      />

      <NQueensBoard
        board={board}
        rows={rows}
        cols={cols}
        showAttacked={showAttacked}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}
