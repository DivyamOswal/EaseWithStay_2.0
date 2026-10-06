'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { TripDetail } from '@/lib/services/trips';

const colors = {
  pine: '#142B45',
  pine2: '#2C4A6E',
  coral: '#2D6CDF',
  coralDark: '#1E52B8',
  brass: '#C99A3D',
  lagoon: '#3D6FA5',
  lagoonSoft: '#E4ECF7',
  sand: '#FBF6EC',
  ink: '#1E2430',
  paperLine: '#E4DECB',
  success: '#3F7A56',
  muted: '#8A8270',
  body: '#5B5343',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.ink,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.paperLine,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandMark: {
    fontSize: 10,
    color: colors.coral,
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Times-Roman',
    color: colors.pine,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  statusBadge: {
    fontSize: 8,
    color: colors.success,
    backgroundColor: '#EFF6EE',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  metaText: {
    fontSize: 9,
    color: colors.muted,
  },

  // Summary band
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.sand,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginBottom: 22,
  },
  summaryCell: {
    flexDirection: 'column',
  },
  summaryLabel: {
    fontSize: 8,
    color: colors.muted,
    letterSpacing: 0.6,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 11,
    color: colors.pine,
    fontWeight: 'bold',
  },
  summaryValueAccent: {
    fontSize: 11,
    color: colors.coral,
    fontWeight: 'bold',
  },

  // Day
  day: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.paperLine,
    paddingBottom: 6,
    marginBottom: 8,
  },
  dayHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayNum: {
    fontSize: 8,
    color: colors.brass,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  dayTitle: {
    fontSize: 12,
    color: colors.pine,
    fontFamily: 'Times-Roman',
  },
  dayLocation: {
    fontSize: 8.5,
    color: colors.lagoon,
  },

  // Item
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  itemTime: {
    width: 46,
    fontSize: 8.5,
    color: colors.muted,
    paddingTop: 1,
  },
  itemBody: {
    flex: 1,
    paddingRight: 10,
  },
  itemTitle: {
    fontSize: 10,
    color: colors.pine,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  itemNotes: {
    fontSize: 8.5,
    color: colors.body,
    lineHeight: 1.35,
  },
  itemCost: {
    width: 60,
    textAlign: 'right',
    fontSize: 9.5,
    color: colors.pine,
    fontWeight: 'bold',
    paddingTop: 1,
  },
  itemType: {
    fontSize: 7,
    color: colors.lagoon,
    backgroundColor: colors.lagoonSoft,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginLeft: 6,
    letterSpacing: 0.4,
  },

  // Tips
  tips: {
    marginTop: 20,
    backgroundColor: colors.sand,
    borderRadius: 6,
    padding: 14,
  },
  tipsTitle: {
    fontSize: 9,
    color: colors.pine,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  tipLine: {
    fontSize: 9,
    color: colors.body,
    lineHeight: 1.5,
    marginBottom: 3,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: colors.paperLine,
    fontSize: 7.5,
    color: colors.muted,
  },
});

function formatMoney(minor: number | null, currency: string) {
  if (minor == null || minor === 0) return '';
  const symbol = currency === 'INR' ? 'Rs ' : currency + ' ';
  return `${symbol}${(minor / 100).toLocaleString('en-IN')}`;
}

function formatDateRange(start: Date | null, end: Date | null) {
  if (!start || !end) return 'Dates not set';
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return `${new Date(start).toLocaleDateString('en-IN', opts)} – ${new Date(
    end,
  ).toLocaleDateString('en-IN', opts)}`;
}

function readTime(metadata: unknown): { start: string; end: string } {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    const m = metadata as Record<string, unknown>;
    return {
      start: typeof m.startTime === 'string' ? m.startTime : '',
      end: typeof m.endTime === 'string' ? m.endTime : '',
    };
  }
  return { start: '', end: '' };
}

function typeLabel(t: string) {
  switch (t) {
    case 'HOTEL':
      return 'STAY';
    case 'FLIGHT':
      return 'FLIGHT';
    case 'ACTIVITY':
      return 'ACTIVITY';
    case 'RESTAURANT':
      return 'FOOD';
    case 'TRANSPORT':
      return 'TRANSPORT';
    default:
      return 'NOTE';
  }
}

export function TripPDFDocument({ trip }: { trip: TripDetail }) {
  const destName = trip.destination?.name ?? 'Any destination';

  return (
    <Document
      title={`${trip.title} — EaseWithStay`}
      author="EaseWithStay"
      subject={`Itinerary for ${destName}`}
      creator="EaseWithStay"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* ============ HEADER ============ */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandMark}>EASEWITHSTAY · ITINERARY</Text>
          </View>
          <Text style={styles.title}>{trip.title}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusBadge}>{trip.status}</Text>
            <Text style={styles.metaText}>
              {trip.days.length} {trip.days.length === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        {/* ============ SUMMARY ============ */}
        <View style={styles.summary}>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryLabel}>Destination</Text>
            <Text style={styles.summaryValue}>{destName}</Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryLabel}>Dates</Text>
            <Text style={styles.summaryValue}>
              {formatDateRange(trip.startDate, trip.endDate)}
            </Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={styles.summaryLabel}>Estimated total</Text>
            <Text style={styles.summaryValueAccent}>
              {formatMoney(trip.budgetMinor, trip.currency) || '—'}
            </Text>
          </View>
        </View>

        {/* ============ DAYS ============ */}
        {trip.days.map((day) => (
          <View key={day.id} style={styles.day} wrap={false}>
            <View style={styles.dayHeader}>
              <View style={styles.dayHeaderLeft}>
                <Text style={styles.dayNum}>DAY {day.dayIndex + 1}</Text>
                <Text style={styles.dayTitle}>{day.title ?? 'Untitled day'}</Text>
              </View>
              {day.notes ? (
                <Text style={styles.dayLocation}>{day.notes}</Text>
              ) : null}
            </View>

            {day.items.map((item) => {
              const { start, end } = readTime(item.metadata);
              const timeText = start
                ? end
                  ? `${start}–${end}`
                  : start
                : '—';
              const cost = formatMoney(item.costMinor, trip.currency);

              return (
                <View key={item.id} style={styles.item}>
                  <Text style={styles.itemTime}>{timeText}</Text>
                  <View style={styles.itemBody}>
                    <Text style={styles.itemTitle}>
                      {item.title}
                      <Text style={styles.itemType}>
                        {'  '}
                        {typeLabel(item.type)}
                      </Text>
                    </Text>
                    {item.notes ? (
                      <Text style={styles.itemNotes}>{item.notes}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.itemCost}>{cost}</Text>
                </View>
              );
            })}
          </View>
        ))}

        {/* ============ TIPS ============ */}
        <View style={styles.tips} wrap={false}>
          <Text style={styles.tipsTitle}>Good to know</Text>
          <Text style={styles.tipLine}>
            • Prices are estimates until checkout. Final prices are re-verified
            before payment.
          </Text>
          <Text style={styles.tipLine}>
            • This itinerary was generated by EaseWithStay using AI assistance and
            verified reference material.
          </Text>
          <Text style={styles.tipLine}>
            • For changes, refunds, or questions, contact support@easewithstay.com
            with your booking reference.
          </Text>
        </View>

        {/* ============ FOOTER ============ */}
        <View style={styles.footer} fixed>
          <Text>EaseWithStay · easewithstay.com</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}