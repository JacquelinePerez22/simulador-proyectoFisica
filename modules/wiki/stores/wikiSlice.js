import { createSlice } from '@reduxjs/toolkit';
import wikiData from '../../../data/wikiData.json';

const initialState = {
  currentIndex: 0,
  totalItems: wikiData.length,
};

export const wikiSlice = createSlice({
  name: 'wiki',
  initialState,
  reducers: {
    nextCard: (state) => {
      if (state.currentIndex < state.totalItems - 1) {
        state.currentIndex += 1;
      }
    },
    previousCard: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },
    setCardIndex: (state, action) => {
      if (action.payload >= 0 && action.payload < state.totalItems) {
        state.currentIndex = action.payload;
      }
    },
  },
});

export const { nextCard, previousCard, setCardIndex } = wikiSlice.actions;
export default wikiSlice.reducer;