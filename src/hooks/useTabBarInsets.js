import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Medidas de la barra de pestañas flotante
export const TAB_BAR_HEIGHT = 72;
const TAB_BAR_MARGIN = Platform.OS === 'ios' ? 24 : 16; // separación sobre el borde inferior
const CONTENT_GAP = 16; // aire entre el contenido y la barra

/**
 * Calcula la posición de la barra de pestañas flotante y el espacio que deben
 * reservar las pantallas, sumando el área segura inferior del sistema
 * (botones de navegación de Android, indicador de inicio de iOS).
 */
export function useTabBarInsets() {
  const { bottom } = useSafeAreaInsets();

  // En iOS el indicador de inicio ya deja margen; en Android se suma al de la barra
  const tabBarBottom = Platform.OS === 'ios' ? Math.max(TAB_BAR_MARGIN, bottom) : TAB_BAR_MARGIN + bottom;

  return {
    tabBarBottom,
    // Espacio inferior que debe dejar el contenido para no quedar bajo la barra
    contentBottomPadding: tabBarBottom + TAB_BAR_HEIGHT + CONTENT_GAP,
  };
}
