import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/themes/ThemeContext';
import { DesignVariant, themes } from '../../src/themes';

const designPreviews: { variant: DesignVariant; emoji: string }[] = [
  { variant: 'jacob-original', emoji: '📐' },
  { variant: 'zen-flow', emoji: '🌙' },
  { variant: 'ember', emoji: '🔥' },
];

export default function DesignPicker() {
  const { theme, setVariant, variant } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top + 20 }]}>
      <Text style={[styles.title, { color: theme.text }]}>Choose Your Style</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Each design offers a different experience
      </Text>

      {designPreviews.map(({ variant: v, emoji }) => {
        const t = themes[v];
        const isActive = variant === v;
        return (
          <TouchableOpacity
            key={v}
            onPress={() => {
              setVariant(v);
              router.back();
            }}
            style={[
              styles.card,
              {
                backgroundColor: t.card,
                borderColor: isActive ? t.accent : t.cardBorder,
                borderWidth: isActive ? 2 : 1,
              },
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: t.text }]}>{t.name}</Text>
              <Text style={[styles.cardDesc, { color: t.textSecondary }]}>{t.description}</Text>
            </View>
            {isActive && (
              <View style={[styles.activeBadge, { backgroundColor: t.accent }]}>
                <Text style={[styles.activeBadgeText, { color: t.accentText }]}>Active</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 28 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    gap: 14,
  },
  emoji: { fontSize: 32 },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardDesc: { fontSize: 14, marginTop: 2 },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadgeText: { fontSize: 12, fontWeight: '600' },
});
