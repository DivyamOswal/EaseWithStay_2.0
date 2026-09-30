import { LegalLayout, type LegalSection } from '@/components/layout/legal-layout';

const sections: LegalSection[] = [
  {
    id: 'using',
    heading: 'Using EaseWithStay',
    body: "You must be at least 18 years old and able to enter a binding contract to book travel through the platform. You're responsible for the accuracy of the traveler details you provide, since they're used directly for hotel, flight and activity bookings.",
  },
  {
    id: 'bookings',
    heading: 'Bookings & payments',
    body: 'Prices shown during planning are estimates until checkout, where they are re-verified against the relevant provider. A booking is only confirmed once payment has cleared and the provider has confirmed availability.',
  },
  {
    id: 'cancellations',
    heading: 'Cancellations & refunds',
    body: 'Cancellation terms vary by hotel, airline and activity provider and are shown before you pay. Refunds are processed to your original payment method within the timeframe stated at checkout.',
  },
  {
    id: 'ai',
    heading: 'AI-generated content',
    body: 'Itineraries, recommendations and answers are generated with AI assistance and may occasionally be inaccurate. Final prices and availability are always verified by our systems before a booking is confirmed.',
  },
  {
    id: 'liability',
    heading: 'Liability',
    body: 'EaseWithStay acts as an agent between you and the travel providers. We are not liable for delays, cancellations, or service failures caused by the providers themselves, though we will assist you in resolving any issue.',
  },
  {
    id: 'governing',
    heading: 'Governing law',
    body: 'These terms are governed by the laws of India. Any disputes arising from the use of the platform will be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.',
  },
];

export const metadata = {
  title: 'Terms of Service — EaseWithStay',
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="These terms govern your use of EaseWithStay's planning and booking platform."
      updated="Sep 1, 2026"
      sections={sections}
    />
  );
}