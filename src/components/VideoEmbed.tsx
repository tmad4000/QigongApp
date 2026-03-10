import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Linking,
} from 'react-native';

interface VideoEmbedProps {
  url: string;
  accentColor: string;
  themeCard: string;
  themeCardBorder: string;
  themeTextSecondary: string;
}

function parseVideoUrl(url: string): { type: 'youtube' | 'facebook' | 'unknown'; embedUrl: string } {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, with optional ?t= or &t= or ?start=
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) {
    const videoId = ytMatch[1];
    // Extract timestamp from various formats
    let startSec = 0;
    const tMatch = url.match(/[?&]t=(\d+)/);
    if (tMatch) startSec = parseInt(tMatch[1], 10);

    const params = new URLSearchParams({
      autoplay: '0',
      rel: '0',
      modestbranding: '1',
      ...(startSec > 0 ? { start: String(startSec) } : {}),
    });

    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
    };
  }

  // Facebook: facebook.com/watch/?v=ID or facebook.com/.../videos/ID
  const fbMatch = url.match(/facebook\.com\/(?:watch\/?\?v=|.*\/videos\/)(\d+)/);
  if (fbMatch) {
    const videoId = fbMatch[1];
    const encodedUrl = encodeURIComponent(url);
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=560`,
    };
  }

  return { type: 'unknown', embedUrl: url };
}

export function VideoEmbed({ url, accentColor, themeCard, themeCardBorder, themeTextSecondary }: VideoEmbedProps) {
  const [expanded, setExpanded] = useState(false);
  const { type, embedUrl } = parseVideoUrl(url);
  const { width: windowWidth } = useWindowDimensions();

  // Responsive: fill container on mobile, cap at 800px on desktop
  const maxVideoWidth = Platform.OS === 'web' ? Math.min(windowWidth - 40, 800) : windowWidth - 40;
  const aspectRatio = expanded ? 4 / 3 : 16 / 9;

  if (type === 'unknown') {
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(url)}
        style={[styles.fallbackBtn, { backgroundColor: themeCard, borderColor: themeCardBorder }]}
      >
        <Text style={[styles.fallbackText, { color: accentColor }]}>
          {'\u25B6\uFE0F'} Open Video
        </Text>
      </TouchableOpacity>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.videoWrapper,
            {
              width: '100%',
              maxWidth: maxVideoWidth,
              aspectRatio,
              borderColor: themeCardBorder,
              backgroundColor: '#000',
            },
          ]}
        >
          {/* @ts-ignore - iframe is valid on web */}
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: 12 } as any}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </View>
        <View style={styles.videoControls}>
          <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.controlBtn}>
            <Text style={[styles.controlText, { color: themeTextSecondary }]}>
              {expanded ? 'Smaller' : 'Larger'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(url)} style={styles.controlBtn}>
            <Text style={[styles.controlText, { color: themeTextSecondary }]}>
              Open externally {'\u2197'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Native: use WebView with HTML wrapper for YouTube/Facebook embeds
  const WebView = require('react-native-webview').default;
  const html = `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>*{margin:0;padding:0;overflow:hidden;background:#000}iframe{width:100%;height:100%;border:none}</style>
</head><body>
<iframe src="${embedUrl}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;fullscreen" allowfullscreen></iframe>
</body></html>`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.videoWrapper,
          {
            width: maxVideoWidth,
            aspectRatio,
            borderColor: themeCardBorder,
            backgroundColor: '#000',
          },
        ]}
      >
        <WebView
          source={{ html }}
          style={{ flex: 1, borderRadius: 12 }}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
        />
      </View>
      <View style={styles.videoControls}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.controlBtn}>
          <Text style={[styles.controlText, { color: themeTextSecondary }]}>
            {expanded ? 'Smaller' : 'Larger'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(url)} style={styles.controlBtn}>
          <Text style={[styles.controlText, { color: themeTextSecondary }]}>
            Open externally {'\u2197'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  videoWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  controlBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  controlText: {
    fontSize: 13,
    fontWeight: '500',
  },
  fallbackBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  fallbackText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
