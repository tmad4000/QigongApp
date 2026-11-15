import React from 'react';
import { Text } from 'react-native';
import Constants from 'expo-constants';
export default function ReleaseStamp({ color }: { color: string }) {
  return <Text style={{ fontSize: 12, color }}>v{Constants.expoConfig?.version}</Text>;
}
