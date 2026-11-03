import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  calculateWork,
  calculateFx,
  calculateFy,
  calculateAcceleration,
  calculateKinematics,
} from '../../../src/utils/physicsCalculations';

const initialState = {
  force: 50,       // Magnitud de la fuerza (N)
  angle: 30,       // Ángulo con respecto al desplazamiento (°)
  distance: 10,    // Distancia (m)
  mass: 5,         // Masa del cuerpo (kg)
};

export const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    setForce: (state, action) => {
      state.force = action.payload;
    },
    setAngle: (state, action) => {
      state.angle = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setMass: (state, action) => {
      state.mass = action.payload;
    },
    resetValues: () => initialState,
  },
});

export const { setForce, setAngle, setDistance, setMass, resetValues } = simulatorSlice.actions;

// Selectores para valores derivados (memoizado: solo recalcula si cambian las entradas)
const selectSimulator = (state) => state.simulator;

export const selectPhysicsResults = createSelector([selectSimulator], ({ force, angle, distance, mass }) => {
  const work = calculateWork(force, distance, angle);

  return {
    force,
    angle,
    distance,
    mass,
    fx: calculateFx(force, angle),
    fy: calculateFy(force, angle),
    work,
    acceleration: calculateAcceleration(force, angle, mass),
    kinematics: calculateKinematics(work, mass, distance),
  };
});

export default simulatorSlice.reducer;