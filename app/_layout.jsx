import React from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { store } from '../src/stores';
import { lightTheme, darkTheme } from '../src/styles/theme';

function MainLayout() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      {/* Íconos de la barra de estado según el tema de la app (no el del teléfono):
          tema claro → íconos oscuros, tema oscuro → íconos claros.
          En Android edge-to-edge la barra es transparente y muestra el fondo de la app. */}
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
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