import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BOX_SIZE = 50;
const MAX_SCALE_DISTANCE = 50; // m que representa el riel completo
const MIN_DURATION = 500;      // ms: límites para que la animación sea visible
const MAX_DURATION = 6000;

export default function PhysicsAnimation({ distance, mass, angle, acceleration, kinematics }) {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  const [progress, setProgress] = useState(0);   // fracción 0..1 del movimiento
  const [isRunning, setIsRunning] = useState(false);
  const frameRef = useRef(null);

  // Escala espacial: el riel completo equivale a MAX_SCALE_DISTANCE metros
  const availablePx = Math.max(trackWidth - BOX_SIZE, 0);
  const isOutOfScale = distance > MAX_SCALE_DISTANCE;
  const travelPx = (Math.min(Math.max(distance, 0), MAX_SCALE_DISTANCE) / MAX_SCALE_DISTANCE) * availablePx;

  // Escala temporal: se usa el tiempo real, limitado a un rango visible
  const realDurationMs = kinematics.time * 1000;
  const durationMs = Math.min(Math.max(realDurationMs, MIN_DURATION), MAX_DURATION);
  const isTimeScaled = durationMs !== realDurationMs;

  const isMassValid = mass > 0;
  const canAnimate = isMassValid && kinematics.mode !== 'nulo' && travelPx > 0;

  const stopLiveLegend = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  // Si cambian los parámetros, la caja y la leyenda vuelven al inicio
  useEffect(() => {
    translateX.stopAnimation();
    translateX.setValue(0);
    stopLiveLegend();
    setProgress(0);
    setIsRunning(false);
  }, [translateX, distance, mass, angle, kinematics, trackWidth]);

  // Cancela el ciclo de la leyenda al desmontar el componente
  useEffect(() => stopLiveLegend, []);

  const runAnimation = () => {
    translateX.setValue(0);
    stopLiveLegend();
    setProgress(0);
    setIsRunning(true);

    // La leyenda avanza al mismo ritmo que la animación (por cuadro)
    const startTime = Date.now();
    const tick = () => {
      const fraction = Math.min((Date.now() - startTime) / durationMs, 1);
      setProgress(fraction);
      if (fraction < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        setIsRunning(false);
      }
    };
    frameRef.current = requestAnimationFrame(tick);

    // Aceleración constante: x ∝ t² (acelera desde el reposo) o
    // x = d·(1 − (1 − t)²) (frena hasta detenerse al final de d)
    Animated.timing(translateX, {
      toValue: travelPx,
      duration: durationMs,
      easing: kinematics.mode === 'acelera' ? Easing.in(Easing.quad) : Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const statusMessage = !isMassValid
    ? 'Ingresa una masa mayor a 0 kg para simular el movimiento.'
    : kinematics.mode === 'nulo'
      ? 'W = 0: la fuerza no cambia la rapidez del cuerpo. Partiendo del reposo, no se desplaza.'
      : kinematics.mode === 'acelera'
        ? 'W > 0: el cuerpo parte del reposo y la fuerza lo acelera a lo largo de d.'
        : 'W < 0: el cuerpo entra con rapidez inicial y la fuerza lo frena hasta detenerse al final de d.';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.primary }]}>
        {'Simulación de Desplazamiento (d = ' + distance + ' m)'}
      </Text>

      <View style={styles.trackArea} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        {/* Marca de llegada en la posición d */}
        {travelPx > 0 && (
          <View
            style={[
              styles.finishMarker,
              { left: travelPx + BOX_SIZE / 2 - 1, backgroundColor: theme.colors.secondary },
            ]}
          />
        )}

        {/* Bloque desplazable con la flecha de fuerza aplicada a θ */}
        <Animated.View style={[styles.mover, { transform: [{ translateX }] }]}>
          <View style={{ transform: [{ rotate: `${-angle}deg` }] }}>
            <MaterialCommunityIcons name="arrow-right-bold" size={28} color={theme.colors.secondary} />
          </View>
          <View style={[styles.box, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="package-variant-closed" size={32} color="#FFFFFF" />
          </View>
        </Animated.View>

        {/* Línea de suelo / Riel de movimiento */}
        <View style={[styles.groundLine, { backgroundColor: theme.colors.onSurfaceVariant }]} />
      </View>

      <View style={styles.scaleRow}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>0 m</Text>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {MAX_SCALE_DISTANCE + ' m'}
        </Text>
      </View>

      <Text variant="bodySmall" style={[styles.status, { color: theme.colors.onSurface }]}>
        {statusMessage}
      </Text>

      {canAnimate && (
        <LiveLegend
          progress={progress}
          isRunning={isRunning}
          acceleration={acceleration}
          kinematics={kinematics}
          distance={distance}
        />
      )}

      {canAnimate && (isTimeScaled || isOutOfScale) && (
        <Text variant="labelSmall" style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
          {[
            isTimeScaled &&
              `La animación dura ${(durationMs / 1000).toFixed(1)} s (${realDurationMs > durationMs ? 'acelerada' : 'en cámara lenta'}) para que sea visible.`,
            isOutOfScale && `La distancia supera los ${MAX_SCALE_DISTANCE} m del riel y se muestra recortada.`,
          ]
            .filter(Boolean)
            .join(' ')}
        </Text>
      )}

      <Button
        mode="contained-tonal"
        icon="play"
        onPress={runAnimation}
        disabled={!canAnimate}
        style={styles.playButton}
      >
        Ejecutar Animación
      </Button>
    </View>
  );
}

/**
 * Leyenda en tiempo real: con aceleración constante, en el instante t
 *   x(t) = v₀·t + ½·a·t²     v(t) = v₀ + a·t
 * donde t es el tiempo físico (fracción de la animación × tiempo real).
 */
function LiveLegend({ progress, isRunning, acceleration, kinematics, distance }) {
  const theme = useTheme();

  const t = progress * kinematics.time;
  const position = Math.min(kinematics.initialVelocity * t + 0.5 * acceleration * t * t, distance);
  const velocity = Math.max(kinematics.initialVelocity + acceleration * t, 0);

  const isBraking = kinematics.mode === 'frena';
  const accelColor = isBraking ? '#C62828' : '#2E7D32';
  const stateLabel = isRunning
    ? isBraking ? 'Frenando…' : 'Acelerando…'
    : progress >= 1 ? 'Movimiento completado' : 'En reposo, listo para iniciar';

  return (
    <View style={[styles.legend, { borderColor: theme.colors.surfaceVariant }]}>
      <View style={styles.legendHeader}>
        <MaterialCommunityIcons
          name={isBraking ? 'arrow-left-bold' : 'arrow-right-bold'}
          size={20}
          color={accelColor}
        />
        <Text variant="titleSmall" style={[styles.legendAccel, { color: accelColor }]}>
          {'a = ' + acceleration.toFixed(2) + ' m/s²'}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          (constante, a = Fx/m)
        </Text>
      </View>

      <Text variant="labelMedium" style={[styles.legendState, { color: theme.colors.onSurface }]}>
        {stateLabel}
      </Text>

      <View style={styles.dataGrid}>
        <DataItem label="Tiempo (t)" value={t.toFixed(2) + ' / ' + kinematics.time.toFixed(2) + ' s'} />
        <DataItem label="Posición (x)" value={position.toFixed(2) + ' / ' + distance + ' m'} />
        <DataItem label="Rapidez (v)" value={velocity.toFixed(2) + ' m/s'} />
        <DataItem
          label={isBraking ? 'Rapidez inicial (v₀)' : 'Rapidez final (v)'}
          value={(isBraking ? kinematics.initialVelocity : kinematics.finalVelocity).toFixed(2) + ' m/s'}
        />
      </View>
    </View>
  );
}

function DataItem({ label, value }) {
  const theme = useTheme();

  return (
    <View style={styles.dataItem}>
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{label}</Text>
      <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>{value}</Text>
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
    height: 100,
    justifyContent: 'flex-end',
  },
  finishMarker: {
    position: 'absolute',
    bottom: 0,
    width: 2,
    height: 70,
    opacity: 0.6,
  },
  mover: {
    width: BOX_SIZE,
    alignItems: 'center',
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
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
  scaleRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  status: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  legend: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendAccel: {
    fontWeight: 'bold',
  },
  legendState: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  dataGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  playButton: {
    marginTop: 4,
    borderRadius: 20,
  },
});
