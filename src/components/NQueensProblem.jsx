"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import NQueensControls from "./NQueensControls";
import { useToast } from "@/hooks/use-toast";
import NQueensBoard from "./NQueensBoard";

const MIN_SIZE = 4;
const MAX_SIZE = 12;

export default function NQueensProblem() {
  const [size, setSize] = useState(8); // Unified control for rows and columns
  const [board, setBoard] = useState([]);
  const [showAttacked, setShowAttacked] = useState(true);
  const [queenCount, setQueenCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    resetBoard();
  }, [size]);

  const resetBoard = () => {
    const newBoard = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({ hasQueen: false, isAttacked: false }))
      );
    setBoard(newBoard);
    setQueenCount(0);
  };

  const updateAttackedSquares = (newBoard) => {
    const attackedBoard = newBoard.map((row) =>
      row.map(() => ({ hasQueen: false, isAttacked: false }))
    );

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j].hasQueen) {
          attackedBoard[i][j].hasQueen = true;

          for (let k = 0; k < newBoard.length; k++) {
            attackedBoard[k][j].isAttacked = true; // Vertical
            attackedBoard[i][k].isAttacked = true; // Horizontal
          }

          for (let k = 1; k < size; k++) {
            if (i + k < size && j + k < size) attackedBoard[i + k][j + k].isAttacked = true;
            if (i - k >= 0 && j - k >= 0) attackedBoard[i - k][j - k].isAttacked = true;
            if (i + k < size && j - k >= 0) attackedBoard[i + k][j - k].isAttacked = true;
            if (i - k >= 0 && j + k < size) attackedBoard[i - k][j + k].isAttacked = true;
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

    if (newQueenCount === size && isBoardSolved(updatedBoard)) {
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
      <h1 className="text-2xl text-center mb-6">Can you place N queens on the board without any queen attacking any other.</h1>

      <NQueensControls
        size={size}
        setSize={setSize}
        resetBoard={resetBoard}
        showAttacked={showAttacked}
        setShowAttacked={setShowAttacked}
      />

      <NQueensBoard
        board={board}
        rows={size}
        cols={size}
        showAttacked={showAttacked}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
}
