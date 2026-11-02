import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar as PaperProgressBar, Text, useTheme } from 'react-native-paper';

export default function ProgressBar({ currentIndex, total }) {
  const theme = useTheme();
  const progress = (currentIndex + 1) / total;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          PROGRESO DE LECTURA
        </Text>
        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {currentIndex + 1} de {total}
        </Text>
      </View>
      <PaperProgressBar
        progress={progress}
        color={theme.colors.primary}
        style={styles.progressBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});