import { LegalLayout, type LegalSection } from '@/components/layout/legal-layout';

const sections: LegalSection[] = [
  {
    id: 'collect',
    heading: 'Data we collect',
    body: 'Account details, traveler information needed for bookings (names, dates of birth, passport numbers where required), payment metadata, and the content of your planning conversations with our AI.',
  },
  {
    id: 'use',
    heading: 'How we use it',
    body: 'To generate itineraries, complete bookings, verify payments, send trip-related notifications, and improve the accuracy of our AI planner. We do not use your traveler documents for anything beyond the booking they relate to.',
  },
  {
    id: 'sharing',
    heading: 'Sharing with providers',
    body: 'Only the details required to complete a booking are shared with the relevant hotel, airline or activity provider, and with our payment processor to verify transactions.',
  },
  {
    id: 'rights',
    heading: 'Your rights',
    body: "You can request a copy of your data, ask us to correct it, or request deletion of your account, subject to records we're legally required to retain for completed bookings.",
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    body: 'We use a single essential cookie for authentication. We do not use advertising or tracking cookies, and we do not sell data to third parties.',
  },
  {
    id: 'contact',
    heading: 'Contact our DPO',
    body: 'For any privacy-related requests, contact dpo@easewithstay.com. We respond within 30 days, as required by law.',
  },
];

export const metadata = {
  title: 'Privacy Policy — EaseWithStay',
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How EaseWithStay collects, uses, and protects your information."
      updated="Sep 1, 2026"
      sections={sections}
    />
  );
}