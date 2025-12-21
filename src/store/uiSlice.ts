import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  message: string | null;
}

const initialState: UIState = {
  loading: false,
  message: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setMessage,
  clearMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
