import { Footer } from '../Footer'
import CTASection from './CTASection'
import FAQSection from './FAQSection'
import Navbar from './Navbar'
import Hero from './Hero'
import FeatureSection from './FeatureSection'
import ShowcaseSection from './ShowcaseSection'
import HowtoSection from './HowtoSection'
import PricingSection from './PricingSection'

const LandingPage = () => {
  return (
    <>
      <div className='flex flex-col size-full px-[50] py-[50] gap-[80] min-h-screen'>
        <Navbar />
        <Hero />
        <FeatureSection />
        <ShowcaseSection />
        <HowtoSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </>
  )
}

export default LandingPage
