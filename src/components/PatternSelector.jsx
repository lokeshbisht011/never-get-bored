import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PatternSelector = ({ patterns, handlePatternSelect }) => {
  return (
    <div className="mb-6">
      <Select onValueChange={handlePatternSelect}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a pattern" />
        </SelectTrigger>
        <SelectContent>
          {patterns.map((pattern) => (
            <SelectItem key={pattern.name} value={pattern.name}>
              {pattern.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PatternSelector
