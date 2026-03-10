import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/themes/ThemeContext';

function InnerLayout() {
  const { theme, variant } = useTheme();
  return (
    <>
      <StatusBar style={variant === 'zen-flow' ? 'light' : 'dark'} />
      {/* zen-flow-light resolves to dark status bar since it's a light theme */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerLayout />
    </ThemeProvider>
  );
}
