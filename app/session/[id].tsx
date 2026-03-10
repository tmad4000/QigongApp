import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../src/themes/ThemeContext';
import { getSession, Exercise, Session } from '../../src/data/sessions';
import { VideoEmbed } from '../../src/components/VideoEmbed';

const { width } = Dimensions.get('window');

export default function SessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = getSession(id || '');
  const { theme, variant } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (session) setActiveExercise(session.primary);
  }, [session]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Auto-stop timer when session completes
  useEffect(() => {
    if (isPlaying && activeExercise && elapsed >= activeExercise.durationMin * 60) {
      setIsPlaying(false);
    }
  }, [elapsed, isPlaying, activeExercise]);

  if (!session || !activeExercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text, padding: 20 }}>Session not found</Text>
      </View>
    );
  }

  const totalSeconds = activeExercise.durationMin * 60;
  const progress = Math.min(elapsed / totalSeconds, 1);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsed(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button + header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.accent }]}>
              {'\u2190'} Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Session title bar */}
        <View style={styles.titleBar}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sessionTitle, { color: theme.text }]}>
              {session.title} {'\u2013'} {session.subtitle}
            </Text>
          </View>
          <View
            style={[
              styles.durationBadge,
              { backgroundColor: variant === 'zen-flow' ? session.color + '20' : theme.badge },
            ]}
          >
            <Text
              style={[
                styles.durationBadgeText,
                { color: variant === 'zen-flow' ? session.color : theme.badgeText },
              ]}
            >
              {activeExercise.durationMin} min
            </Text>
          </View>
        </View>

        {/* Video embed (default when video available) */}
        {activeExercise.videoUrl && (
          <VideoEmbed
            url={activeExercise.videoUrl}
            accentColor={session.color}
            themeCard={theme.card}
            themeCardBorder={theme.cardBorder}
            themeTextSecondary={theme.textSecondary}
          />
        )}

        {/* Timer / breathing animation (always shown below video, or as primary if no video) */}
        {variant === 'zen-flow' ? (
          <BreathingOrb
            session={session}
            isPlaying={isPlaying}
            progress={progress}
            elapsed={elapsed}
            totalSeconds={totalSeconds}
            formatTime={formatTime}
          />
        ) : variant === 'ember' ? (
          <EmberVisual
            session={session}
            isPlaying={isPlaying}
            progress={progress}
            elapsed={elapsed}
            totalSeconds={totalSeconds}
            formatTime={formatTime}
          />
        ) : variant === 'serenity' ? (
          <SerenityVisual
            session={session}
            theme={theme}
            isPlaying={isPlaying}
            progress={progress}
            elapsed={elapsed}
            totalSeconds={totalSeconds}
            formatTime={formatTime}
          />
        ) : (
          <JacobVisual
            session={session}
            theme={theme}
            elapsed={elapsed}
            totalSeconds={totalSeconds}
            formatTime={formatTime}
            progress={progress}
          />
        )}

        {/* Play/Pause controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            style={[
              styles.playBtn,
              {
                backgroundColor:
                  variant === 'zen-flow' ? session.color : theme.accent,
              },
            ]}
          >
            <Text style={[styles.playBtnText, { color: variant === 'zen-flow' ? '#0D1117' : theme.accentText }]}>
              {progress >= 1 ? 'Complete \u2713' : isPlaying ? 'Pause' : elapsed > 0 ? 'Resume' : 'Begin Practice'}
            </Text>
          </TouchableOpacity>
          {elapsed > 0 && (
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={[styles.resetText, { color: theme.textSecondary }]}>
                Reset
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Exercise description */}
        <Text style={[styles.exerciseTitle, { color: theme.text }]}>
          {activeExercise.title}
        </Text>
        <Text style={[styles.exerciseDesc, { color: theme.textSecondary }]}>
          {activeExercise.description}
        </Text>

        {/* Alternatives */}
        {session.alternatives.length > 0 && (
          <View style={styles.alternativesSection}>
            <Text style={[styles.altHeader, { color: theme.text }]}>Alternatives:</Text>
            {session.alternatives.map((alt) => (
              <TouchableOpacity
                key={alt.id}
                onPress={() => {
                  setActiveExercise(alt);
                  handleReset();
                }}
                style={[
                  styles.altCard,
                  {
                    backgroundColor: theme.card,
                    borderColor:
                      activeExercise.id === alt.id
                        ? session.color
                        : theme.cardBorder,
                    borderWidth: activeExercise.id === alt.id ? 2 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.altTitle,
                    {
                      color:
                        activeExercise.id === alt.id
                          ? session.color
                          : theme.accent,
                    },
                  ]}
                >
                  {alt.title} ({alt.durationMin} min)
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ============ BREATHING ORB (Zen Flow) ============ */
function BreathingOrb({
  session,
  isPlaying,
  progress,
  elapsed,
  totalSeconds,
  formatTime,
}: {
  session: Session;
  isPlaying: boolean;
  progress: number;
  elapsed: number;
  totalSeconds: number;
  formatTime: (s: number) => string;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (isPlaying) {
      // 4-count breathing cycle: inhale 4s, hold 2s, exhale 6s = 12s total
      scale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.35, { duration: 2000 }),
          withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 4000 }),
          withTiming(0.9, { duration: 2000 }),
          withTiming(0.5, { duration: 6000 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 500 });
      opacity.value = withTiming(0.6, { duration: 500 });
    }
  }, [isPlaying]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.visualArea}>
      <View style={styles.orbContainer}>
        <Animated.View style={orbStyle}>
          <LinearGradient
            colors={[session.color, session.color + '40']}
            style={styles.orb}
            start={{ x: 0.3, y: 0.2 }}
            end={{ x: 0.8, y: 0.9 }}
          />
        </Animated.View>
        <View style={styles.orbOverlay}>
          <Text style={styles.orbTimer}>{formatTime(elapsed)}</Text>
          <Text style={styles.orbTotal}>/ {formatTime(totalSeconds)}</Text>
        </View>
      </View>
      {/* Progress ring */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: session.color + '20' }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: session.color, width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

/* ============ EMBER VISUAL ============ */
function EmberVisual({
  session,
  isPlaying,
  progress,
  elapsed,
  totalSeconds,
  formatTime,
}: any) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.visualArea}>
      <Animated.View style={pulseStyle}>
        <View
          style={[
            styles.emberCircle,
            {
              borderColor: session.color,
              backgroundColor: session.color + '10',
            },
          ]}
        >
          <Text style={[styles.emberEmoji]}>{session.icon}</Text>
          <Text style={[styles.emberTimer, { color: session.color }]}>
            {formatTime(elapsed)}
          </Text>
        </View>
      </Animated.View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: session.color + '20' }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: session.color,
                width: `${progress * 100}%`,
                borderRadius: 4,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

/* ============ SERENITY VISUAL ============ */
function SerenityVisual({
  session,
  theme,
  isPlaying,
  progress,
  elapsed,
  totalSeconds,
  formatTime,
}: any) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 500 });
    }
  }, [isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.serenityVisualContainer}>
      <Animated.View style={[styles.serenityVisualCircle, pulseStyle, { backgroundColor: session.color + '08' }]}>
         <Text style={styles.serenityVisualIconLarge}>{session.icon}</Text>
      </Animated.View>

      <View style={styles.serenityVisualTimerContainer}>
        <Text style={[styles.serenityVisualTimer, { color: theme.text }]}>
          {formatTime(elapsed)}
        </Text>
        <Text style={[styles.serenityVisualTotal, { color: theme.textMuted }]}>
          / {formatTime(totalSeconds)}
        </Text>
      </View>

      <View style={[styles.serenityProgressBar, { backgroundColor: theme.cardBorder || '#E5E7EB' }]}>
        <View
          style={[
            styles.serenityProgressFill,
            { backgroundColor: theme.accent, width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

/* ============ JACOB ORIGINAL VISUAL ============ */
function JacobVisual({
  session,
  theme,
  elapsed,
  totalSeconds,
  formatTime,
  progress,
}: any) {
  return (
    <View style={styles.visualArea}>
      <View style={[styles.jacobVideoPlaceholder, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.jacobPlaceholderText, { color: theme.textMuted }]}>
          {session.icon}
        </Text>
        <Text style={[styles.jacobTimerText, { color: theme.text }]}>
          {formatTime(elapsed)} / {formatTime(totalSeconds)}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.card }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.accent, width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  topBar: { marginBottom: 12 },
  backBtn: { alignSelf: 'flex-start', padding: 4 },
  backText: { fontSize: 16, fontWeight: '500' },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sessionTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.3 },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 12,
  },
  durationBadgeText: { fontSize: 14, fontWeight: '600' },

  // Visual area
  visualArea: {
    alignItems: 'center',
    marginBottom: 24,
  },

  // Orb (Zen)
  orbContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbTimer: { fontSize: 28, fontWeight: '700', color: '#fff' },
  orbTotal: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  // Ember circle
  emberCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emberEmoji: { fontSize: 48 },
  emberTimer: { fontSize: 24, fontWeight: '700', marginTop: 8 },

  // Jacob placeholder
  jacobVideoPlaceholder: {
    width: width - 40,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jacobPlaceholderText: { fontSize: 48 },
  jacobTimerText: { fontSize: 20, fontWeight: '600', marginTop: 12 },

  // Progress
  progressBarContainer: { width: '100%', marginTop: 16 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 28,
  },
  playBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
  },
  playBtnText: { fontSize: 16, fontWeight: '700' },
  resetBtn: { padding: 12 },
  resetText: { fontSize: 14, fontWeight: '500' },

  // Exercise info
  exerciseTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  exerciseDesc: { fontSize: 15, lineHeight: 22, marginBottom: 16 },

  // Video button
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  videoBtnEmoji: { fontSize: 16 },
  videoBtnText: { fontSize: 15, fontWeight: '600' },

  // Alternatives
  alternativesSection: { marginTop: 4 },
  altHeader: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  altCard: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  altTitle: { fontSize: 15, fontWeight: '500' },

  // Serenity Visual
  serenityVisualContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  serenityVisualCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  serenityVisualIconLarge: { fontSize: 80 },
  serenityVisualTimerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  serenityVisualTimer: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
  },
  serenityVisualTotal: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 8,
    opacity: 0.6,
  },
  serenityProgressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F2F4F7',
    overflow: 'hidden',
  },
  serenityProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
