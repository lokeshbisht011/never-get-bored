import React, { useRef, useEffect, useState } from 'react'

export default function SierpinskiCanvas({
  initialPoints,
  color,
  isSimulating,
  onClick,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const simulatingRef = useRef(isSimulating) // Ref to track isSimulating
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })

  // Update the simulatingRef whenever isSimulating changes
  useEffect(() => {
    simulatingRef.current = isSimulating
  }, [isSimulating])

  // Adjust canvas size dynamically
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        const height = (width * 10) / 16 // Maintain aspect ratio 16:10
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw initial points
    initialPoints.forEach((point) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })
  }, [initialPoints, color, dimensions])

  useEffect(() => {
    if (!isSimulating || initialPoints.length < 3) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Choose a random starting point inside the triangle
    let currentPoint = {
      x: (initialPoints[0].x + initialPoints[1].x + initialPoints[2].x) / 3,
      y: (initialPoints[0].y + initialPoints[1].y + initialPoints[2].y) / 3
    }

    const drawPoint = () => {
      if (!simulatingRef.current) return // Check the ref value to stop simulation

      // Randomly select one of the initial points
      const targetPoint = initialPoints[Math.floor(Math.random() * initialPoints.length)]

      // Find the midpoint between the current point and the selected initial point
      currentPoint = {
        x: (currentPoint.x + targetPoint.x) / 2,
        y: (currentPoint.y + targetPoint.y) / 2
      }

      // Plot the new point
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(currentPoint.x, currentPoint.y, 1, 0, 2 * Math.PI)
      ctx.fill()

      // Continue the simulation
      requestAnimationFrame(drawPoint)
    }

    drawPoint()
  }, [isSimulating, initialPoints, color]) // Use simulatingRef for stopping logic

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    onClick({ x, y })
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="border border-gray-300 cursor-crosshair w-full h-full"
      />
    </div>
  )
}
