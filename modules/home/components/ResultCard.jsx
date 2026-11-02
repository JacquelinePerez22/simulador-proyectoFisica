import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Divider, useTheme } from 'react-native-paper';
import { getWorkInterpretation } from '../../../src/utils/physicsCalculations';

export default function ResultCard({ work, fx, fy, angle }) {
  const theme = useTheme();
  const interpretation = getWorkInterpretation(angle, work);

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <Text variant="labelLarge" style={[styles.headerLabel, { color: theme.colors.primary }]}>
          RESULTADOS DEL TRABAJO MECÁNICO
        </Text>

        <View style={[styles.workDisplay, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Trabajo Mecánico Realizado (W):
          </Text>
          <Text variant="displaySmall" style={[styles.workValue, { color: theme.colors.primary }]}>
            {work.toFixed(2)} J
          </Text>
        </View>

        <Chip
          icon="information-outline"
          style={[styles.interpretationChip, { backgroundColor: interpretation.color + '22' }]}
          textStyle={{ color: interpretation.color, fontWeight: 'bold' }}
        >
          {interpretation.type}
        </Chip>

        <Text variant="bodySmall" style={[styles.interpretationText, { color: theme.colors.onSurface }]}>
          {interpretation.description}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.componentsRow}>
          <View style={styles.componentItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Componente Paralela (Fx):
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              {fx.toFixed(2)} N
            </Text>
          </View>

          <View style={styles.componentItem}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Componente Perpendicular (Fy):
            </Text>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.secondary }}>
              {fy.toFixed(2)} N
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    marginVertical: 10,
  },
  content: {
    padding: 16,
  },
  headerLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workDisplay: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  workValue: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  interpretationChip: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  interpretationText: {
    textAlign: 'center',
    lineHeight: 18,
    marginHorizontal: 10,
  },
  divider: {
    marginVertical: 12,
  },
  componentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  componentItem: {
    alignItems: 'center',
  },
});