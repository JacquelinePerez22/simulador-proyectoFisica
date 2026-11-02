import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WikiCard({ item }) {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
          {item.title}
        </Text>
        <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.secondary }]}>
          {item.subtitle}
        </Text>

        <View style={[styles.formulaBox, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons name="function-variant" size={24} color={theme.colors.primary} />
          <Text variant="titleLarge" style={[styles.formulaText, { color: theme.colors.primary }]}>
            {item.formula}
          </Text>
        </View>

        <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurface }]}>
          {item.description}
        </Text>

        <Divider style={styles.divider} />

        <Text variant="titleSmall" style={[styles.sectionHeader, { color: theme.colors.primary }]}>
          PUNTOS CLAVE / CONCEPTOS:
        </Text>
        {item.keyPoints.map((point, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={theme.colors.primary} />
            <Text variant="bodyMedium" style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}>
              {point}
            </Text>
          </View>
        ))}

        <Divider style={styles.divider} />

        <View style={styles.appContainer}>
          <Chip icon="lightbulb-on-outline" style={{ backgroundColor: theme.colors.surfaceVariant }}>
            Aplicación en la Vida Real
          </Chip>
          <Text variant="bodyMedium" style={[styles.appText, { color: theme.colors.onSurface }]}>
            {item.application}
          </Text>
        </View>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardContent: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  formulaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  formulaText: {
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  description: {
    lineHeight: 22,
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  sectionHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletText: {
    flex: 1,
    lineHeight: 20,
  },
  appContainer: {
    marginTop: 6,
    gap: 8,
  },
  appText: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
});