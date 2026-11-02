import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { Text, TextInput, useTheme, Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../src/components/Header';
import ForceVectorChart from '../components/ForceVectorChart';
import PhysicsAnimation from '../components/PhysicsAnimation';
import ResultCard from '../components/ResultCard';
import { setForce, setAngle, setDistance, selectPhysicsResults, resetValues } from '../stores/simulatorSlice';

export default function SimulatorScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const results = useSelector(selectPhysicsResults);
  const { width } = useWindowDimensions();

  // Detecta si la pantalla es ancha (Web o Tablet superior a 768px)
  const isDesktopWeb = Platform.OS === 'web' && width >= 768;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Simulador de Trabajo Mecánico" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={isDesktopWeb ? styles.gridContainer : styles.stackContainer}>
          {/* Componente 1: Parámetros de Entrada */}
          <View style={isDesktopWeb ? styles.gridItem : styles.stackItem}>
            <Card style={styles.cardInput} mode="elevated">
              <Card.Content>
                <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.primary }]}>
                  Parámetros de Entrada
                </Text>

                <TextInput
                  label="Magnitud de Fuerza (N)"
                  value={String(results.force)}
                  keyboardType="numeric"
                  onChangeText={(text) => dispatch(setForce(Number(text) || 0))}
                  mode="outlined"
                  style={styles.input}
                />

                <TextInput
                  label="Ángulo respecto al desplazamiento (°)"
                  value={String(results.angle)}
                  keyboardType="numeric"
                  onChangeText={(text) => dispatch(setAngle(Number(text) || 0))}
                  mode="outlined"
                  style={styles.input}
                />

                <TextInput
                  label="Distancia del desplazamiento (m)"
                  value={String(results.distance)}
                  keyboardType="numeric"
                  onChangeText={(text) => dispatch(setDistance(Number(text) || 0))}
                  mode="outlined"
                  style={styles.input}
                />

                <Button mode="text" onPress={() => dispatch(resetValues())} style={styles.resetButton}>
                  Restablecer Valores
                </Button>
              </Card.Content>
            </Card>
          </View>

          {/* Componente 2: Visualización de Resultados */}
          <View style={isDesktopWeb ? styles.gridItem : styles.stackItem}>
            <ResultCard
              work={results.work}
              fx={results.fx}
              fy={results.fy}
              angle={results.angle}
            />
          </View>

          {/* Componente 3: Gráfico Vectorial SVG */}
          <View style={isDesktopWeb ? styles.gridItem : styles.stackItem}>
            <ForceVectorChart
              force={results.force}
              angle={results.angle}
              fx={results.fx}
              fy={results.fy}
            />
          </View>

          {/* Componente 4: Animación Interactiva del Desplazamiento */}
          <View style={isDesktopWeb ? styles.gridItem : styles.stackItem}>
            <PhysicsAnimation
              distance={results.distance}
              force={results.force}
              work={results.work}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110, // Margen suficiente para evitar solapamiento con la TabBar flotante
  },
  // Contenedor en cuadricula para Web/Escritorio (2x2)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 16,
  },
  gridItem: {
    width: '48.5%', // Ocupa la mitad del espacio para formar la matriz de 2 en 2
    marginBottom: 8,
  },
  // Contenedor en columna para dispositivos móviles
  stackContainer: {
    flexDirection: 'column',
  },
  stackItem: {
    width: '100%',
    marginBottom: 10,
  },
  cardInput: {
    width: '100%',
    borderRadius: 16,
    height: '100%', // Sincroniza la altura en la fila de la cuadrícula
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 10,
  },
  resetButton: {
    alignSelf: 'flex-end',
  },
});