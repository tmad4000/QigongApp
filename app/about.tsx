import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/themes/ThemeContext';

const RESOURCES = [
  {
    title: 'Qigong Garden',
    description: 'Curated collection of qigong resources, practices, and community',
    url: 'https://qigong.garden',
    emoji: '🌱',
  },
  {
    title: 'Max Strom – Breathe to Heal',
    description: 'Books, courses, and facilitator training for breath-based healing',
    url: 'https://maxstrom.com',
    emoji: '🌬️',
  },
  {
    title: 'Forest Rock Qigong',
    description: 'Peter Caughey\'s online qigong classes and teacher training',
    url: 'https://forestrockqigong.com',
    emoji: '🌲',
  },
  {
    title: 'Eden Energy Medicine',
    description: 'Donna Eden\'s energy medicine courses and Daily Energy Routine',
    url: 'https://edenenergymedicine.com',
    emoji: '✨',
  },
  {
    title: 'Zhineng Qigong Student Hub',
    description: 'Lift Qi Up Pour Qi Down training videos and community',
    url: 'https://www.zhineng-qigong-students-hub.com',
    emoji: '🏔️',
  },
];

export default function AboutScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme.accent }]}>{'\u2190'} Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>About & Resources</Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Qi Flow is a guided qigong practice app. Each session pairs a timer with
          curated exercises — use the video guides to learn, then practice solo with
          just the breathing animation and timer.
        </Text>

        <Text style={[styles.sectionHeader, { color: theme.text }]}>Resources</Text>

        {RESOURCES.map((resource) => (
          <TouchableOpacity
            key={resource.url}
            onPress={() => Linking.openURL(resource.url)}
            style={[styles.resourceCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Text style={styles.resourceEmoji}>{resource.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resourceTitle, { color: theme.accent }]}>{resource.title}</Text>
              <Text style={[styles.resourceDesc, { color: theme.textSecondary }]}>{resource.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  backBtn: { alignSelf: 'flex-start', padding: 4, marginBottom: 12 },
  backText: { fontSize: 16, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 28 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginBottom: 14 },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  resourceEmoji: { fontSize: 28 },
  resourceTitle: { fontSize: 15, fontWeight: '600' },
  resourceDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  footer: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: { fontSize: 12 },
});
