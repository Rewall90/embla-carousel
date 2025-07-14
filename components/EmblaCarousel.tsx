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

  const handleDragStart = useCallback(() => {
    dragStartPos.current = {
      x: 0,
      time: Date.now()
    }
  }, [])

  const handleDragEnd = useCallback((emblaApi: any) => {
    if (!dragStartPos.current || isPhysicsScrolling.current) return

    const deltaTime = Date.now() - dragStartPos.current.time
    if (deltaTime < 50) return // Too quick, ignore

    // Simple velocity based on drag duration and distance
    const velocity = 1000 / Math.max(deltaTime, 100) // Inverse of time
    const direction = Math.random() > 0.5 ? 1 : -1 // Simple direction for now
    
    const currentIndex = emblaApi.selectedScrollSnap()
    const physics = calculatePhysics(velocity, currentIndex, direction)
    
    isPhysicsScrolling.current = true
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