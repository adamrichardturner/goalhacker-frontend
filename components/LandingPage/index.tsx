import { Footer } from '../Footer'
import CTASection from './CTASection'
import FAQSection from './FAQSection'
import FeatureSection from './FeatureSection'
import Hero from './Hero'
import HowtoSection from './HowtoSection'
import Navbar from './Navbar'
import PricingSection from './PricingSection'
import ShowcaseSection from './ShowcaseSection'

const LandingPage = () => {
  return (
    <div className='flex flex-col size-full px-[50] py-[50] gap-[80] min-h-screen bg-gradient-to-r from-[#0C101D] to-[#364883]'>
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
  )
}

export default LandingPage
