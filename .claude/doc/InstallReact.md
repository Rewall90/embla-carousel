React
Embla Carousel provides a wrapper for React that ensures seamless integration of the carousel into your React project and automatic cleanup on component unmount.

Start by installing the Embla Carousel npm package and add it to your dependencies.

npm install embla-carousel-react --save

The component structure
Embla Carousel provides the handy useEmblaCarousel hook for seamless integration with React. A minimal setup requires an overflow wrapper and a scroll container. Start by adding the following structure to your carousel:


import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel()

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">Slide 1</div>
        <div className="embla__slide">Slide 2</div>
        <div className="embla__slide">Slide 3</div>
      </div>
    </div>
  )
}


Styling the carousel
The hook gives us a ref to attach to our wrapping element with the classname embla, which is needed to cover the scroll overflow. The element with the container classname is the scroll body that scrolls the slides. Continue by adding the following CSS to these elements:

.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}

Accessing the carousel API
The useEmblaCarousel hook takes the Embla Carousel options as the first argument. Additionally, you can access the API with a useEffect like demonstrated below:

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">Slide 1</div>
        <div className="embla__slide">Slide 2</div>
        <div className="embla__slide">Slide 3</div>
      </div>
    </div>
  )
}


Adding plugins
Start by installing the plugin you want to use. In this example, we're going to install the Autoplay plugin:
npm install embla-carousel-autoplay --save

The useEmblaCarousel hook accepts plugins as the second argument. Note that plugins need to be passed in an array like so: 
import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()])

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">Slide 1</div>
        <div className="embla__slide">Slide 2</div>
        <div className="embla__slide">Slide 3</div>
      </div>
    </div>
  )
}

Congratulations! You just created your first Embla Carousel component.