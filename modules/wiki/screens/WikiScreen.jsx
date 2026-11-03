import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../src/components/Header';
import ProgressBar from '../components/ProgressBar';
import WikiCard from '../components/WikiCard';
import { useTabBarInsets } from '../../../src/hooks/useTabBarInsets';
import { nextCard, previousCard } from '../stores/wikiSlice';
import wikiData from '../../../data/wikiData.json';

export default function WikiScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { contentBottomPadding } = useTabBarInsets();
  const currentIndex = useSelector((state) => state.wiki.currentIndex);
  const currentItem = wikiData[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Wiki de Física 1" />
      <ProgressBar currentIndex={currentIndex} total={wikiData.length} />

      <View style={styles.cardContainer}>
        <WikiCard item={currentItem} />
      </View>

      <View style={[styles.navRow, { paddingBottom: contentBottomPadding }]}>
        <Button
          mode="outlined"
          icon="arrow-left"
          disabled={currentIndex === 0}
          onPress={() => dispatch(previousCard())}
          style={styles.navButton}
        >
          Anterior
        </Button>
        <Button
          mode="contained"
          icon="arrow-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          disabled={currentIndex === wikiData.length - 1}
          onPress={() => dispatch(nextCard())}
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
        >
          Siguiente
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    // paddingBottom se calcula con useTabBarInsets (barra flotante + área segura)
    gap: 12,
  },
  navButton: {
    flex: 1,
    borderRadius: 24,
    marginBottom: 8,
  },
});