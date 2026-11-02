import { createSlice } from '@reduxjs/toolkit';
import { calculateWork, calculateFx, calculateFy } from '../../../src/utils/physicsCalculations';

const initialState = {
  force: 50,       // Magnitud de la fuerza (N)
  angle: 30,       // Ángulo con respecto al desplazamiento (°)
  distance: 10,    // Distancia (m)
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
    resetValues: (state) => {
      state.force = initialState.force;
      state.angle = initialState.angle;
      state.distance = initialState.distance;
    },
  },
});

export const { setForce, setAngle, setDistance, resetValues } = simulatorSlice.actions;

// Selectores para valores derivados
export const selectPhysicsResults = (state) => {
  const { force, angle, distance } = state.simulator;
  const fx = calculateFx(force, angle);
  const fy = calculateFy(force, angle);
  const work = calculateWork(force, distance, angle);

  return {
    force,
    angle,
    distance,
    fx,
    fy,
    work,
  };
};

export default simulatorSlice.reducer;