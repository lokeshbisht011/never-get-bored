"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import PatternSelector from "./PatternSelector";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const CELL_SIZE = 20;
const DEFAULT_ROWS = 100;
const DEFAULT_COLS = 100;
const MIN_SPEED = 100;
const VIEWPORT_SIZE = 800;

const patterns = [
  {
    name: "Blinker",
    cells: [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  },
  {
    name: "Glider",
    cells: [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  {
    name: "Pulsar",
    cells: [
      [2, 4],
      [2, 5],
      [2, 6],
      [2, 10],
      [2, 11],
      [2, 12],
      [4, 2],
      [4, 7],
      [4, 9],
      [4, 14],
      [5, 2],
      [5, 7],
      [5, 9],
      [5, 14],
      [6, 2],
      [6, 7],
      [6, 9],
      [6, 14],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 10],
      [7, 11],
      [7, 12],
      [9, 4],
      [9, 5],
      [9, 6],
      [9, 10],
      [9, 11],
      [9, 12],
      [10, 2],
      [10, 7],
      [10, 9],
      [10, 14],
      [11, 2],
      [11, 7],
      [11, 9],
      [11, 14],
      [12, 2],
      [12, 7],
      [12, 9],
      [12, 14],
      [14, 4],
      [14, 5],
      [14, 6],
      [14, 10],
      [14, 11],
      [14, 12],
    ],
  },
  {
    name: "Gosper Glider Gun",
    cells: [
      [25, 1],
      [23, 2],
      [25, 2],
      [13, 3],
      [14, 3],
      [21, 3],
      [22, 3],
      [35, 3],
      [36, 3],
      [12, 4],
      [16, 4],
      [21, 4],
      [22, 4],
      [35, 4],
      [36, 4],
      [1, 5],
      [2, 5],
      [11, 5],
      [17, 5],
      [21, 5],
      [22, 5],
      [1, 6],
      [2, 6],
      [11, 6],
      [15, 6],
      [17, 6],
      [18, 6],
      [23, 6],
      [25, 6],
      [11, 7],
      [17, 7],
      [25, 7],
      [12, 8],
      [16, 8],
      [13, 9],
      [14, 9],
    ],
  },
  {
    name: "Lightweight Spaceship",
    cells: [
      [1, 1],
      [1, 4],
      [2, 5],
      [3, 1],
      [3, 5],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
    ],
  },
  {
    name: "Pentadecathlon",
    cells: [
      [5, 6],
      [5, 7],
      [4, 8],
      [6, 8],
      [5, 9],
      [5, 10],
      [5, 11],
      [5, 12],
      [5, 13],
      [5, 14],
      [4, 15],
      [6, 15],
      [5, 16],
      [5, 17],
    ],
  },
];

function createEmptyGrid(rows, cols) {
  return new Map();
}

function produce(base, recipe) {
  const copy = new Map(base);
  recipe(copy);
  return copy;
}

export default function GameOfLife() {
  const [grid, setGrid] = useState(() =>
    createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const runningRef = useRef(isRunning);
  const canvasRef = useRef(null);
  const { toast } = useToast();

  runningRef.current = isRunning;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        g.forEach((value, key) => {
          const [i, j] = key.split(",").map(Number);
          let neighbors = 0;
          for (let x of [-1, 0, 1]) {
            for (let y of [-1, 0, 1]) {
              if (x === 0 && y === 0) continue;
              const newI = i + x;
              const newJ = j + y;
              if (g.get(`${newI},${newJ}`)) neighbors++;
            }
          }
          if (neighbors < 2 || neighbors > 3) {
            gridCopy.delete(key);
          }
        });

        g.forEach((value, key) => {
          const [i, j] = key.split(",").map(Number);
          for (let x of [-1, 0, 1]) {
            for (let y of [-1, 0, 1]) {
              if (x === 0 && y === 0) continue;
              const newI = i + x;
              const newJ = j + y;
              const newKey = `${newI},${newJ}`;
              if (!g.has(newKey)) {
                let neighbors = 0;
                for (let xx of [-1, 0, 1]) {
                  for (let yy of [-1, 0, 1]) {
                    if (xx === 0 && yy === 0) continue;
                    if (g.has(`${newI + xx},${newJ + yy}`)) neighbors++;
                  }
                }
                if (neighbors === 3) {
                  gridCopy.set(newKey, 1);
                }
              }
            }
          }
        });
      });
    });

    setGeneration((gen) => gen + 1);
    setTimeout(runSimulation, speed);
  }, [speed]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const handleClear = () => {
    setGrid(createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
    setGeneration(0);
  };

  const handlePatternSelect = (patternName) => {
    const pattern = patterns.find((p) => p.name === patternName);
    if (pattern) {
      setGrid(createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS));
      const newGrid = produce(new Map(), (gridCopy) => {
        pattern.cells.forEach(([x, y]) => {
          gridCopy.set(`${x},${y}`, 1);
        });
      });
      setGrid(newGrid);
      setGeneration(0);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(
      (event.clientX - rect.left) / (CELL_SIZE * zoom) + offset.x
    );
    const y = Math.floor(
      (event.clientY - rect.top) / (CELL_SIZE * zoom) + offset.y
    );

    setGrid((g) =>
      produce(g, (gridCopy) => {
        const key = `${x},${y}`;
        if (gridCopy.has(key)) {
          gridCopy.delete(key);
        } else {
          gridCopy.set(key, 1);
        }
      })
    );
  };

  const handleWheel = () => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.1, Math.min(z * zoomFactor, 5)));
  };

  const handleMouseDown = (event) => {
    const startX = event.clientX;
    const startY = event.clientY;
    const startOffset = { ...offset };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setOffset({
        x: startOffset.x - dx / (CELL_SIZE * zoom),
        y: startOffset.y - dy / (CELL_SIZE * zoom),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Game of Life Simulation</h1>

      <ControlPanel
        isRunning={isRunning}
        handleStartStop={handleStartStop}
        handleClear={handleClear}
        speed={speed}
        setSpeed={setSpeed}
      />

      <PatternSelector
        patterns={patterns}
        handlePatternSelect={handlePatternSelect}
      />

      <div className="mb-4 text-lg font-medium">Generation: {generation}</div>

      <Canvas
        canvasRef={canvasRef}
        grid={grid}
        zoom={zoom}
        offset={offset}
        setGrid={setGrid}
        handleCanvasClick={handleCanvasClick}
        handleWheel={handleWheel}
        handleMouseDown={handleMouseDown}
      />

      <Toaster />
    </div>
  );
}
