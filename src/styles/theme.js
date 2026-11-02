import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1B5E20',       // Verde oscuro principal
    secondary: '#66BB6A',     // Verde medio
    tertiary: '#A5D6A7',      // Verde claro
    background: '#E8F5E9',    // Fondo claro suave
    surface: '#FFFFFF',
    surfaceVariant: '#A5D6A7',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1B5E20',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#66BB6A',       // Verde medio para destacar sobre fondo oscuro
    secondary: '#A5D6A7',
    tertiary: '#81C784',
    background: '#050E06',    // Fondo casi negro (tono de fondo muy profundo)
    surface: '#0E1E10',       // Superficies/Tarjetas con tono verde-negro muy suave
    surfaceVariant: '#152C17', // Elevaciones secundarias
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#E8F5E9',  // Texto blanco verdoso para alto contraste
    onSurface: '#E8F5E9',
    onSurfaceVariant: '#C8E6C9',
  },
};