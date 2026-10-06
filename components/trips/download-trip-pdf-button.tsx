'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import type { TripDetail } from '@/lib/services/trips';
import { TripPDFDocument } from './trip-pdf-document';

function filenameFor(title: string) {
  const slug = title
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `${slug || 'trip'}-itinerary.pdf`;
}

export function DownloadTripPDFButton({ trip }: { trip: TripDetail }) {
  const filename = filenameFor(trip.title);

  return (
    <PDFDownloadLink
      document={<TripPDFDocument trip={trip} />}
      fileName={filename}
    >
      {({ loading }) => (
        <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-coral)] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-coral-dark)]">
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Preparing…
            </>
          ) : (
            <>
              <Download size={14} />
              Download PDF
            </>
          )}
        </span>
      )}
    </PDFDownloadLink>
  );
}