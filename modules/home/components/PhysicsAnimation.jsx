import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PhysicsAnimation({ distance, force, work }) {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  const runAnimation = () => {
    // Resetea la posición inicial del objeto
    translateX.setValue(0);

    // Animación fluida de desplazamiento proporcional a la distancia
    Animated.timing(translateX, {
      toValue: 180, // Recorrido visual máximo en píxeles sobre la pantalla
      duration: Math.max(1500, Math.min(3000, Number(distance) * 100)),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}>
        {'Simulación de Desplazamiento (d = ' + distance + ' m)'}
      </Text>

      <View style={styles.trackArea}>
        {/* Bloque / Caja desplazable */}
        <Animated.View
          style={[
            styles.box,
            { backgroundColor: theme.colors.primary, transform: [{ translateX }] },
          ]}
        >
          <MaterialCommunityIcons name="package-variant-closed" size={32} color="#FFFFFF" />
        </Animated.View>

        {/* Línea de suelo / Riel de movimiento */}
        <View style={[styles.groundLine, { backgroundColor: theme.colors.onSurfaceVariant }]} />
      </View>

      <Button
        mode="contained-tonal"
        icon="play"
        onPress={runAnimation}
        style={styles.playButton}
      >
        Ejecutar Animación
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    elevation: 2,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  trackArea: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  box: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 3,
  },
  groundLine: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  playButton: {
    marginTop: 4,
    borderRadius: 20,
  },
});