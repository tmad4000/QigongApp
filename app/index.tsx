import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/themes/ThemeContext';
import { SESSIONS, Session } from '../src/data/sessions';
import { DesignVariant, themes } from '../src/themes';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

export default function HomeScreen() {
  const { theme, variant, setVariant } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{theme.name}</Text>
          {variant === 'zen-flow' && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Cultivate your energy
            </Text>
          )}
        </View>

        {/* Design switcher */}
        <View style={styles.designSwitcher}>
          {(Object.keys(themes) as DesignVariant[]).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setVariant(v)}
              style={[
                styles.designPill,
                {
                  backgroundColor: variant === v ? theme.accent : theme.card,
                  borderColor: variant === v ? theme.accent : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.designPillText,
                  { color: variant === v ? theme.accentText : theme.textSecondary },
                ]}
              >
                {themes[v].description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session grid */}
        {variant === 'jacob-original' ? (
          <JacobGrid sessions={SESSIONS} router={router} theme={theme} />
        ) : variant === 'zen-flow' ? (
          <ZenFlowGrid sessions={SESSIONS} router={router} theme={theme} />
        ) : (
          <EmberGrid sessions={SESSIONS} router={router} theme={theme} />
        )}
      </ScrollView>
    </View>
  );
}

/* ============ JACOB ORIGINAL ============ */
function JacobGrid({ sessions, router, theme }: any) {
  return (
    <View style={styles.grid}>
      {sessions.map((session: Session) => (
        <TouchableOpacity
          key={session.id}
          style={[
            styles.jacobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              width: CARD_WIDTH,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => router.push(`/session/${session.id}`)}
        >
          <Text style={[styles.jacobCardTitle, { color: theme.text }]}>
            {session.title} {'\u2013'} {session.subtitle}
          </Text>
          <Text style={[styles.jacobCardDuration, { color: theme.textSecondary }]}>
            {session.durationMin} min
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ============ ZEN FLOW (Calm-inspired) ============ */
function ZenFlowGrid({ sessions, router, theme }: any) {
  return (
    <View style={styles.zenGrid}>
      {sessions.map((session: Session, i: number) => (
        <TouchableOpacity
          key={session.id}
          activeOpacity={0.85}
          onPress={() => router.push(`/session/${session.id}`)}
          style={[styles.zenCardOuter, i === 0 && styles.zenCardFeatured]}
        >
          <LinearGradient
            colors={[session.color + '30', session.color + '08']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.zenCard,
              {
                borderColor: session.color + '30',
                height: i === 0 ? 180 : 140,
              },
            ]}
          >
            <View style={styles.zenCardHeader}>
              <Text style={styles.zenIcon}>{session.icon}</Text>
              <View
                style={[
                  styles.zenBadge,
                  { backgroundColor: session.color + '20' },
                ]}
              >
                <Text style={[styles.zenBadgeText, { color: session.color }]}>
                  {session.durationMin} min
                </Text>
              </View>
            </View>
            <View style={styles.zenCardBody}>
              <Text style={[styles.zenCardTitle, { color: theme.text }]}>
                {session.title}
              </Text>
              <Text style={[styles.zenCardSubtitle, { color: session.color }]}>
                {session.subtitle}
              </Text>
            </View>
            {i === 0 && (
              <Text style={[styles.zenCardDesc, { color: theme.textSecondary }]}>
                {session.primary.title}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* ============ EMBER (Breathwrk-inspired) ============ */
function EmberGrid({ sessions, router, theme }: any) {
  return (
    <View style={styles.emberGrid}>
      {sessions.map((session: Session) => (
        <TouchableOpacity
          key={session.id}
          activeOpacity={0.85}
          onPress={() => router.push(`/session/${session.id}`)}
          style={[
            styles.emberCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              borderLeftColor: session.color,
              borderLeftWidth: 4,
            },
          ]}
        >
          <View style={styles.emberCardTop}>
            <Text style={styles.emberIcon}>{session.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.emberCardTitle, { color: theme.text }]}>
                {session.title}
              </Text>
              <Text style={[styles.emberCardSubtitle, { color: session.color }]}>
                {session.subtitle}
              </Text>
            </View>
            <View
              style={[
                styles.emberBadge,
                { backgroundColor: session.color + '20' },
              ]}
            >
              <Text style={[styles.emberBadgeText, { color: session.color }]}>
                {session.durationMin}m
              </Text>
            </View>
          </View>
          <Text
            style={[styles.emberCardDesc, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {session.primary.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginTop: 4, opacity: 0.7 },

  // Design switcher
  designSwitcher: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  designPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  designPillText: { fontSize: 13, fontWeight: '500' },

  // Jacob original
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  jacobCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  jacobCardTitle: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  jacobCardDuration: { fontSize: 14, marginTop: 12 },

  // Zen Flow
  zenGrid: { gap: 14 },
  zenCardOuter: {},
  zenCardFeatured: {},
  zenCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  zenCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zenIcon: { fontSize: 28 },
  zenBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  zenBadgeText: { fontSize: 12, fontWeight: '600' },
  zenCardBody: { marginTop: 8 },
  zenCardTitle: { fontSize: 20, fontWeight: '700' },
  zenCardSubtitle: { fontSize: 14, fontWeight: '500', marginTop: 2 },
  zenCardDesc: { fontSize: 13, marginTop: 8 },

  // Ember
  emberGrid: { gap: 12 },
  emberCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  emberCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emberIcon: { fontSize: 32 },
  emberCardTitle: { fontSize: 17, fontWeight: '700' },
  emberCardSubtitle: { fontSize: 13, fontWeight: '600' },
  emberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  emberBadgeText: { fontSize: 13, fontWeight: '700' },
  emberCardDesc: { fontSize: 13, marginTop: 10 },
});
