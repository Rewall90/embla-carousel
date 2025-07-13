import { EmblaOptionsType } from 'embla-carousel'
import EmblaCarousel from '../components/EmblaCarousel'
import Header from '../components/Header'
import Footer from '../components/Footer'

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 9
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  return (
    <>
      <Header />
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      <Footer />
    </>
  )
}