import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoProps {
  size?: number;
  color?: string;
  variant?: 'minimal' | 'full';
}

export function Logo({ size = 48, color = '#6EC6A7', variant = 'full' }: LogoProps) {
  const strokeWidth = size * 0.12;
  const radius = (size - strokeWidth) / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Enso Circle Mark */}
      <View
        style={[
          styles.ensoRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderBottomColor: 'transparent', // Enso open gap
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      {/* Subtle Energy Glow */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[color + '40', 'transparent']}
          style={[
            styles.glow,
            {
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ensoRing: {
    position: 'absolute',
    opacity: 0.9,
    zIndex: 2,
  },
  glowContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  glow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
