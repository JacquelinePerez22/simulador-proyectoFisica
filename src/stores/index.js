import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import wikiReducer from '../../modules/wiki/stores/wikiSlice';
import simulatorReducer from '../../modules/home/stores/simulatorSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    wiki: wikiReducer,
    simulator: simulatorReducer,
  },
});