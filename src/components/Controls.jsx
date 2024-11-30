import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

export default function Controls({
  numPoints,
  setNumPoints,
  color,
  setColor,
  isSimulating,
  startSimulation,
  stopSimulation,
  resetSimulation
}) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="mb-4 flex space-x-4 items-center">
        <label className="text-sm font-medium text-gray-700">
          Number of initial points:
        </label>
        <Slider
          value={[numPoints]}
          onValueChange={(value) => setNumPoints(value[0])}
          min={3}
          max={10}
          step={1}
          className="w-48"
        />
        <span>{numPoints}</span>
      </div>

      <div className="mb-4 flex space-x-4 items-center">
        <label className="text-sm font-medium text-gray-700">
          Point color:
        </label>
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-8"
        />
      </div>

      <div className="flex space-x-4">
        <Button onClick={startSimulation} disabled={isSimulating}>
          Start Simulation
        </Button>
        <Button onClick={stopSimulation} disabled={!isSimulating}>
          Stop
        </Button>
        <Button onClick={resetSimulation}>
          Reset
        </Button>
      </div>
    </div>
  )
}
