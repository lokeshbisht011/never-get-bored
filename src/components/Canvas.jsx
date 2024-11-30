import React, { useEffect } from 'react'

const Canvas = ({ canvasRef, grid, zoom, offset, setGrid, handleCanvasClick, handleWheel, handleMouseDown }) => {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)

    const cellSize = 20 * zoom
    const offsetX = -offset.x * cellSize
    const offsetY = -offset.y * cellSize

    context.fillStyle = '#3b82f6'
    grid.forEach((value, key) => {
      const [x, y] = key.split(',').map(Number)
      context.fillRect(
        x * cellSize + offsetX,
        y * cellSize + offsetY,
        cellSize - 1,
        cellSize - 1
      )
    })

    // Draw grid lines
    context.strokeStyle = '#000000'
    context.lineWidth = 0.5
    for (let x = 0; x <= canvas.width; x += cellSize) {
      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, canvas.height)
      context.stroke()
    }
    for (let y = 0; y <= canvas.height; y += cellSize) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(canvas.width, y)
      context.stroke()
    }
  }, [grid, zoom, offset])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ cursor: 'move' }}
      className="border border-gray-300"
    />
  )
}

export default Canvas
