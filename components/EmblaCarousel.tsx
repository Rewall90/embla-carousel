'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { useWheelPhysics } from './useWheelPhysics'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { calculatePhysics } = useWheelPhysics(slides.length)
  
  const dragStartPos = useRef<{ x: number; time: number } | null>(null)
  const isPhysicsScrolling = useRef(false)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const handleDragStart = useCallback((emblaApi: any) => {
    const startProgress = emblaApi.scrollProgress()
    dragStartPos.current = {
      x: startProgress,
      time: Date.now()
    }
  }, [])

  const handleDragEnd = useCallback((emblaApi: any) => {
    if (!dragStartPos.current || isPhysicsScrolling.current) return

    const endProgress = emblaApi.scrollProgress()
    const deltaTime = Date.now() - dragStartPos.current.time
    const deltaX = endProgress - dragStartPos.current.x
    
    if (deltaTime < 50 || Math.abs(deltaX) < 0.01) return // Too quick or too small

    // Calculate velocity from actual movement
    const velocity = Math.abs(deltaX) / (deltaTime / 1000) // units per second
    const direction = deltaX > 0 ? 1 : -1 // Proper direction detection
    
    const currentIndex = emblaApi.selectedScrollSnap()
    const physics = calculatePhysics(velocity, currentIndex, direction)
    
    isPhysicsScrolling.current = true
    
    // Use the physics target directly (wraps around due to loop: true)
    emblaApi.scrollTo(physics.targetIndex)
    
    setTimeout(() => {
      isPhysicsScrolling.current = false
    }, physics.duration)
    
    dragStartPos.current = null
  }, [calculatePhysics])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerDown', handleDragStart)
    emblaApi.on('settle', handleDragEnd)

    return () => {
      emblaApi.off('pointerDown', handleDragStart)
      emblaApi.off('settle', handleDragEnd)
    }
  }, [emblaApi, handleDragStart, handleDragEnd])

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div 
              className={'embla__slide'.concat(
                index === selectedIndex ? ' is-selected' : ''
              )} 
              key={index}
            >
              <div className="embla__slide__number">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel