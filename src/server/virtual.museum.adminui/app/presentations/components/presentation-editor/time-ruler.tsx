"use client"

import { SECONDS_PER_UNIT, UNIT_WIDTH } from "./utils"

interface TimeRulerProps {
  totalDuration: number
}

export function TimeRuler({ totalDuration }: TimeRulerProps) {
  return (
    <div className="h-8 border-b flex items-end relative">
      {Array.from({ length: Math.ceil(totalDuration / SECONDS_PER_UNIT) + 1 }).map((_, i) => (
        <div key={i} className="absolute bottom-0 flex flex-col items-center" style={{ left: i * UNIT_WIDTH }}>
          <div className="h-2 w-px bg-border"></div>
          <div className="text-xs text-muted-foreground">{i * SECONDS_PER_UNIT}s</div>
        </div>
      ))}
    </div>
  )
}
