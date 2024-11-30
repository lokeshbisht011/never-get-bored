import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

const ControlPanel = ({ isRunning, handleStartStop, handleClear, speed, setSpeed }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Button onClick={handleStartStop}>
        {isRunning ? "Stop" : "Start"}
      </Button>
      <Button onClick={handleClear}>Clear</Button>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Speed (ms)
        </label>
        <Slider
          value={[speed]}
          onValueChange={(value) => setSpeed(value[0])}
          min={100}
          max={2000}
          step={100}
          className="w-48"
        />
      </div>
    </div>
  )
}

export default ControlPanel
