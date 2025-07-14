'use client'

import { useCallback } from 'react'

interface PhysicsResult {
  targetIndex: number
  duration: number
}

export const useWheelPhysics = (slideCount: number) => {
  const calculatePhysics = useCallback((
    velocity: number,
    currentIndex: number,
    direction: 1 | -1
  ): PhysicsResult => {
    // Simple momentum calculation: higher velocity = more slides
    const momentum = Math.abs(velocity) * 70
    
    // Calculate distance with simple friction
    const distance = Math.max(momentum * 0.9, 1)
    
    // Calculate target index with wrapping
    const rawTarget = currentIndex + (direction * distance)
    const targetIndex = ((Math.round(rawTarget) % slideCount) + slideCount) % slideCount
    
    // Dynamic duration based on swipe aggressiveness
    const baseTime = 600
    const velocityMultiplier = Math.min(velocity * 2000, 3000) // Aggressive = longer
    const distanceTime = distance * 200
    const duration = baseTime + velocityMultiplier + distanceTime
    
    return {
      targetIndex,
      duration: Math.min(duration, 5000)
    }
  }, [slideCount])

  return { calculatePhysics }
}