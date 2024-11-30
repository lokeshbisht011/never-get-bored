import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NQueensControls = ({
  rows,
  cols,
  setRows,
  setCols,
  resetBoard,
  isSquareGridEnabled,
  setIsSquareGridEnabled,
  showAttacked,
  setShowAttacked,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-6 items-center justify-center">
      <div className="flex gap-12">
        <div className="flex flex-col items-center w-full sm:w-auto">
          <Label htmlFor="rows-slider" className="mb-2 text-center">
            Rows: {rows}
          </Label>
          <Slider
            id="rows-slider"
            min={4}
            max={12}
            step={1}
            value={[rows]}
            onValueChange={(value) => setRows(value[0])}
            className="w-full sm:w-48"
          />
        </div>

        <div className="flex flex-col items-center w-full sm:w-auto">
          <Label htmlFor="cols-slider" className="mb-2 text-center">
            Columns: {cols}
          </Label>
          <Slider
            id="cols-slider"
            min={4}
            max={12}
            step={1}
            value={[cols]}
            onValueChange={(value) => setCols(value[0])}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
        <Switch
          id="square-grid-toggle"
          checked={isSquareGridEnabled}
          onCheckedChange={(checked) => {
            setIsSquareGridEnabled(checked);
            if (checked) {
              // Call the function to set square grid when toggled on
              setRows(Math.max(rows, cols));
              setCols(Math.max(rows, cols));
            }
          }}
        />
        <Label htmlFor="square-grid-toggle" className="text-center">
          {isSquareGridEnabled ? "Disable Square Board" : "Enable Square Board"}
        </Label>
      </div>

      <button
        onClick={resetBoard}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
      >
        Reset Board
      </button>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
        <Switch
          id="show-attacked"
          checked={showAttacked}
          onCheckedChange={setShowAttacked}
        />
        <Label htmlFor="show-attacked" className="text-center">
          Show Attacked Squares
        </Label>
      </div>
    </div>
  );
};

export default NQueensControls;
