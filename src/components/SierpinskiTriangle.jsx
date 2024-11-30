'use client'

import React, { useState } from 'react'
import { Toaster } from "@/components/ui/toaster"
import Controls from './Controls'
import SierpinskiCanvas from './SierpinskiCanvas'
import { useToast } from '@/hooks/use-toast'

const MIN_POINTS = 3
const MAX_POINTS = 10

export default function SierpinskiTriangle() {
  const [initialPoints, setInitialPoints] = useState([])
  const [numPoints, setNumPoints] = useState(3)
  const [color, setColor] = useState('#000000')
  const [isSimulating, setIsSimulating] = useState(false)
  const { toast } = useToast()

  const arePointsCollinear = (points) => {
    if (points.length < 3) return false

    const [p1, p2, ...rest] = points
    const slope = (p2.y - p1.y) / (p2.x - p1.x)

    return rest.every(p => {
      const currentSlope = (p.y - p1.y) / (p.x - p1.x)
      return Math.abs(currentSlope - slope) < 0.001 // Allow for small floating-point errors
    })
  }

  const startSimulation = () => {
    if (initialPoints.length < MIN_POINTS) {
      toast({
        title: "Not enough points",
        description: `Please place at least ${MIN_POINTS} points to start the simulation.`,
        duration: 3000,
      })
      return
    }

    if (arePointsCollinear(initialPoints)) {
      toast({
        title: "Collinear points detected",
        description: "The points are collinear. Please reposition them to form a non-linear shape.",
        duration: 5000,
      })
      return
    }

    setIsSimulating(true)
  }

  const stopSimulation = () => {
    setIsSimulating(false)
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setInitialPoints([])
  }

  const handleCanvasClick = (point) => {
    if (isSimulating) return

    if (initialPoints.length < numPoints) {
      setInitialPoints([...initialPoints, point])
    } else {
      toast({
        title: "Maximum points reached",
        description: `You can only place up to ${numPoints} points.`,
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Sierpinski Triangle Simulation</h1>

      <Controls
        numPoints={numPoints}
        setNumPoints={setNumPoints}
        color={color}
        setColor={setColor}
        isSimulating={isSimulating}
        startSimulation={startSimulation}
        stopSimulation={stopSimulation}
        resetSimulation={resetSimulation}
      />

      <div className="w-full max-w-3xl aspect-[16/10]">
        <SierpinskiCanvas
          initialPoints={initialPoints}
          color={color}
          isSimulating={isSimulating}
          onClick={handleCanvasClick}
        />
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Click inside the rectangle to place initial points (up to {numPoints}).
        {initialPoints.length < MIN_POINTS && (
          <span className="font-bold"> Place at least {MIN_POINTS} points to start.</span>
        )}
      </p>

      <Toaster />
    </div>
  )
}
