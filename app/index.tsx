import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/themes/ThemeContext';
import { SESSIONS, Session } from '../src/data/sessions';
import { DesignVariant, themes } from '../src/themes';
import { Logo } from '../src/components/Logo';

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
          <View style={styles.headerTop}>
            <Logo size={40} color={theme.accent} />
            <View style={styles.headerTextGroup}>
              <Text style={[styles.title, { color: theme.text }]}>{theme.name}</Text>
              {(variant === 'zen-flow' || variant === 'zen-flow-light') && (
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Cultivate your energy
                </Text>
              )}
            </View>
          </View>
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
        ) : variant === 'zen-flow' || variant === 'zen-flow-light' ? (
          <ZenFlowGrid sessions={SESSIONS} router={router} theme={theme} />
        ) : variant === 'serenity' ? (
          <SerenityGrid sessions={SESSIONS} router={router} theme={theme} />
        ) : (
          <EmberGrid sessions={SESSIONS} router={router} theme={theme} />
        )}

        {/* About / More Resources */}
        <TouchableOpacity
          onPress={() => router.push('/about')}
          style={[styles.aboutLink, { borderTopColor: theme.cardBorder }]}
        >
          <Text style={[styles.aboutLinkText, { color: theme.textSecondary }]}>
            About & Resources
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ============ SERENITY (Clean & Modern) ============ */
function SerenityGrid({ sessions, router, theme }: any) {
  return (
    <View style={styles.serenityGrid}>
      {sessions.map((session: Session, i: number) => {
        if (i === 0) {
          return (
            <TouchableOpacity
              key={session.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/session/${session.id}`)}
              style={[
                styles.serenityFeaturedCard,
                { backgroundColor: theme.accent },
              ]}
            >
              <View style={styles.serenityFeaturedTop}>
                <View style={styles.serenityBadge}>
                  <Text style={[styles.serenityBadgeText, { color: theme.accent }]}>FEATURED</Text>
                </View>
                <Text style={styles.serenityIconLarge}>{session.icon}</Text>
              </View>
              <View style={styles.serenityFeaturedBottom}>
                <Text style={[styles.serenityFeaturedTitle, { color: theme.accentText }]}>{session.title}</Text>
                <Text style={[styles.serenityFeaturedSubtitle, { color: theme.accentText + 'BF' }]}>{session.subtitle}</Text>
                <View style={styles.serenityFeaturedMeta}>
                   <Text style={[styles.serenityFeaturedDuration, { color: theme.accentText + '80' }]}>{session.durationMin} minutes</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={session.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/session/${session.id}`)}
            style={[
              styles.serenityCard,
              { backgroundColor: theme.card },
            ]}
          >
            <View style={[styles.serenityIconContainer, { backgroundColor: session.color + '12' }]}>
              <Text style={styles.serenityIcon}>{session.icon}</Text>
            </View>
            <View style={styles.serenityContent}>
              <Text style={[styles.serenityTitle, { color: theme.text }]}>{session.title}</Text>
              <Text style={[styles.serenitySubtitle, { color: theme.textSecondary }]}>{session.subtitle}</Text>
            </View>
            <View style={styles.serenityMeta}>
              <Text style={[styles.serenityDuration, { color: theme.textMuted }]}>{session.durationMin}m</Text>
              <View style={[styles.serenityChevron, { borderColor: theme.textMuted }]} />
            </View>
          </TouchableOpacity>
        );
      })}
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
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerTextGroup: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 2, opacity: 0.7 },

  // Design switcher
  designSwitcher: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

  // Serenity
  serenityGrid: { gap: 12 },
  serenityFeaturedCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  serenityFeaturedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  serenityBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serenityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  serenityIconLarge: { fontSize: 48 },
  serenityFeaturedBottom: {},
  serenityFeaturedTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  serenityFeaturedSubtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  serenityFeaturedMeta: {
    marginTop: 16,
  },
  serenityFeaturedDuration: {
    fontSize: 13,
    fontWeight: '600',
  },
  serenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serenityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serenityIcon: { fontSize: 24 },
  serenityContent: { flex: 1 },
  serenityTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
  serenitySubtitle: { fontSize: 14, marginTop: 2 },
  serenityMeta: { flexDirection: 'row', alignItems: 'center' },
  serenityDuration: { fontSize: 13, fontWeight: '500', marginRight: 8 },
  serenityChevron: {
    width: 8,
    height: 8,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    transform: [{ rotate: '45deg' }],
    opacity: 0.4,
  },

  // About link
  aboutLink: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  aboutLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
