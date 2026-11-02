import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Line, Text as SvgText, Circle } from 'react-native-svg';

export default function ForceVectorChart({ force, angle, fx, fy }) {
  const theme = useTheme();

  // Dimensiones del canvas SVG
  const width = 300;
  const height = 200;
  const originX = 60;
  const originY = 140;
  const vectorScale = 1.2; // Escala visual

  const rad = (angle * Math.PI) / 180;
  const length = Math.min(Math.max(force * vectorScale, 40), 180);

  // Coordenadas punta del vector Fuerza
  const endX = originX + length * Math.cos(rad);
  const endY = originY - length * Math.sin(rad);

  // Coordenadas de las componentes Fx y Fy
  const fxEndX = originX + length * Math.cos(rad);
  const fyEndY = originY - length * Math.sin(rad);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={[styles.chartTitle, { color: theme.colors.primary }]}>
        Gráfico Vectorial de Fuerza
      </Text>

      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Eje X (Desplazamiento d) */}
        <Line x1="20" y1={originY} x2="280" y2={originY} stroke="#9E9E9E" strokeWidth="2" strokeDasharray="4,4" />
        <SvgText x="270" y={originY + 18} fill="#757575" fontSize="12" fontWeight="bold">
          +X (d)
        </SvgText>

        {/* Eje Y */}
        <Line x1={originX} y1="20" x2={originX} y2="180" stroke="#9E9E9E" strokeWidth="2" strokeDasharray="4,4" />
        <SvgText x={originX - 25} y="30" fill="#757575" fontSize="12" fontWeight="bold">
          +Y
        </SvgText>

        {/* Componente Fx */}
        <Line x1={originX} y1={originY} x2={fxEndX} y2={originY} stroke="#4CAF50" strokeWidth="3" />

        {/* Componente Fy */}
        <Line x1={originX} y1={originY} x2={originX} y2={fyEndY} stroke="#2196F3" strokeWidth="3" strokeDasharray="2,2" />

        {/* Vector de Fuerza Principal */}
        <Line x1={originX} y1={originY} x2={endX} y2={endY} stroke={theme.colors.primary} strokeWidth="4" />

        {/* Punto de origen */}
        <Circle cx={originX} cy={originY} r="5" fill={theme.colors.primary} />

        {/* Etiqueta del ángulo θ */}
        <SvgText x={originX + 25} y={originY - 10} fill={theme.colors.primary} fontSize="14" fontWeight="bold">
          {angle + '°'}
        </SvgText>

        {/* Etiqueta del vector F (Texto formateado correctamente) */}
        <SvgText x={endX + 5} y={endY - 5} fill={theme.colors.primary} fontSize="14" fontWeight="bold">
          {'F = ' + force + ' N'}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    elevation: 2,
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});