import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { store } from '../src/stores';
import { lightTheme, darkTheme } from '../src/styles/theme';

function MainLayout() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <MainLayout />
    </ReduxProvider>
  );
}