import { useCallback, useState } from 'react';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowWeWork } from './components/HowWeWork';
import { Integrations } from './components/Integrations';
import { PrivacyDialog } from './components/PrivacyDialog';
import { Services } from './components/Services';
import { Team } from './components/Team';
import { Trust } from './components/Trust';
import { Work } from './components/Work';
import { interestOptions } from './data/content';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';

export default function App() {
  const [interest, setInterest] = useState(interestOptions[0]);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const openPrivacy = useCallback(() => setPrivacyOpen(true), []);

  useRevealOnScroll();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero />
        <Integrations />
        <Services onEnquire={setInterest} />
        <Work />
        <HowWeWork />
        <Trust />
        <Team />
        <Contact interest={interest} onInterestChange={setInterest} onOpenPrivacy={openPrivacy} />
      </main>
      <Footer onOpenPrivacy={openPrivacy} />
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
