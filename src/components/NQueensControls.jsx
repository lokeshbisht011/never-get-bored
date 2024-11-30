import React from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const NQueensControls = ({
  rows,
  cols,
  setRows,
  setCols,
  resetBoard,
  setSquareGrid,
  showAttacked,
  setShowAttacked,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
      <div className="flex flex-col items-center">
        <Label htmlFor="rows-slider" className="mb-2">Rows: {rows}</Label>
        <Slider
          id="rows-slider"
          min={4}
          max={20}
          step={1}
          value={[rows]}
          onValueChange={(value) => setRows(value[0])}
          className="w-48"
        />
      </div>

      <div className="flex flex-col items-center">
        <Label htmlFor="cols-slider" className="mb-2">Columns: {cols}</Label>
        <Slider
          id="cols-slider"
          min={4}
          max={20}
          step={1}
          value={[cols]}
          onValueChange={(value) => setCols(value[0])}
          className="w-48"
        />
      </div>

      <Button onClick={setSquareGrid}>Set Square Grid</Button>
      <Button onClick={resetBoard}>Reset Board</Button>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-attacked"
          checked={showAttacked}
          onCheckedChange={setShowAttacked}
        />
        <Label htmlFor="show-attacked">Show Attacked Squares</Label>
      </div>
    </div>
  )
}

export default NQueensControls
