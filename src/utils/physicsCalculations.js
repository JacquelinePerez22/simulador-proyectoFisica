/**
 * Utilidades para el cálculo de Trabajo Mecánico y Componentes de Fuerza
 */

// Convierte grados a radianes
export const degToRad = (deg) => (deg * Math.PI) / 180;

// Calcula la componente horizontal Fx
export const calculateFx = (force, angleDeg) => {
  const rad = degToRad(angleDeg);
  return force * Math.cos(rad);
};

// Calcula la componente vertical Fy
export const calculateFy = (force, angleDeg) => {
  const rad = degToRad(angleDeg);
  return force * Math.sin(rad);
};

// Calcula el Trabajo Mecánico W = F * d * cos(theta)
export const calculateWork = (force, distance, angleDeg) => {
  const fx = calculateFx(force, angleDeg);
  return fx * distance;
};

// Genera una interpretación cualitativa del tipo de trabajo
export const getWorkInterpretation = (angleDeg, workValue) => {
  const normalizedAngle = ((angleDeg % 360) + 360) % 360;

  if (Math.abs(workValue) < 0.001 || Math.abs(normalizedAngle - 90) < 0.1 || Math.abs(normalizedAngle - 270) < 0.1) {
    return {
      type: 'Trabajo Nulo (W = 0)',
      description: 'La fuerza es perpendicular al desplazamiento. No realiza trabajo dinámico sobre la trayectoria.',
      color: '#FFA000',
    };
  } else if (workValue > 0) {
    return {
      type: 'Trabajo Positivo / Motor (W > 0)',
      description: 'La fuerza aporta energía al cuerpo en la misma dirección del movimiento.',
      color: '#2E7D32',
    };
  } else {
    return {
      type: 'Trabajo Negativo / Resistente (W < 0)',
      description: 'La fuerza se opone al movimiento, substrayendo energía cinética del objeto.',
      color: '#C62828',
    };
  }
};