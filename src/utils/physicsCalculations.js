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

// Aceleración a lo largo del desplazamiento: a = Fx / m (2.ª ley de Newton)
export const calculateAcceleration = (force, angleDeg, mass) => {
  if (!(mass > 0)) return 0;
  return calculateFx(force, angleDeg) / mass;
};

/**
 * Cinemática del cuerpo usando el teorema trabajo-energía (W = ΔEc), con
 * aceleración constante a lo largo de d.
 *
 * - W > 0: el cuerpo parte del reposo y acelera hasta v = √(2W/m).
 * - W < 0: el cuerpo entra con v0 = √(2|W|/m) y la fuerza lo frena hasta
 *          detenerse justo al final de d.
 * - W = 0: la fuerza no cambia la rapidez; partiendo del reposo, no se mueve.
 *
 * En ambos casos con movimiento, el tiempo es t = 2d / v (rapidez media v/2).
 */
export const calculateKinematics = (work, mass, distance) => {
  const isValid = mass > 0 && distance > 0 && Math.abs(work) >= 0.001;
  if (!isValid) {
    return { mode: 'nulo', initialVelocity: 0, finalVelocity: 0, time: 0 };
  }

  const speed = Math.sqrt((2 * Math.abs(work)) / mass);
  const time = (2 * distance) / speed;

  return work > 0
    ? { mode: 'acelera', initialVelocity: 0, finalVelocity: speed, time }
    : { mode: 'frena', initialVelocity: speed, finalVelocity: 0, time };
};
