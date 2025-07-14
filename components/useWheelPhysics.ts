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
    // Enhanced momentum calculation for free spinning
    const momentum = Math.abs(velocity) * 150
    
    // Calculate distance with very low friction
    const distance = Math.max(momentum * 0.98, 0.5)
    
    // Calculate target position without forced snapping (wheel can stop anywhere)
    const rawTarget = currentIndex + (direction * distance)
    const targetIndex = rawTarget // Allow fractional positions - no forced rounding
    
    // Velocity-based duration for realistic deceleration
    const baseTime = 800
    const velocityMultiplier = Math.min(velocity * 3000, 5000) // Aggressive = much longer
    const distanceTime = distance * 100
    const duration = baseTime + velocityMultiplier + distanceTime
    
    return {
      targetIndex: Math.round(targetIndex), // Round to nearest slide for Embla
      duration: Math.min(duration, 8000) // Allow very long spins
    }
  }, [slideCount])

  return { calculatePhysics }
}