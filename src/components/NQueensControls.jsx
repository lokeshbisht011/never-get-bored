import React from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NQueensControls = ({
  size,
  setSize,
  resetBoard,
  showAttacked,
  setShowAttacked,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-6 items-center justify-center">
      <div className="flex flex-col items-center w-full sm:w-auto">
        <Label htmlFor="size-slider" className="mb-2 text-center">
          Board Size(N): {size} x {size}
        </Label>
        <Slider
          id="size-slider"
          min={4}
          max={12}
          step={1}
          value={[size]}
          onValueChange={(value) => setSize(value[0])}
          className="w-full sm:w-48"
        />
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
