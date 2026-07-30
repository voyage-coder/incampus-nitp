import LandingNavbar from '../components/landing/LandingNavbar';
import Hero from '../components/landing/Hero';
import QuickAccess from '../components/landing/QuickAccess';
import Features from '../components/landing/Features';
import CampusLife from '../components/landing/CampusLife';
import MarketplacePreview from '../components/landing/MarketplacePreview';
import PlacementStories from '../components/landing/PlacementStories';
import ResumePreview from '../components/landing/ResumePreview';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div id="top" className="min-h-screen bg-cream">
      <LandingNavbar />
      <Hero />
      <QuickAccess />
      <Features />
      <CampusLife />
      <MarketplacePreview />
      <PlacementStories />
      <ResumePreview />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
