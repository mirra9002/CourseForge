// src/state/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,                         // {id, name, ...} or null
  status: 'loading',                  // 'loading' | 'authed' | 'guest'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) { state.status = 'loading'; state.error = null; },
    setUser(state, action) {
      state.user = action.payload;
      state.status = action.payload ? 'authed' : 'guest';
      state.error = null;
    },
    setError(state, action) { state.error = action.payload; state.status = 'guest'; },
    resetAuth() { return initialState; },
  },
});

export const { setLoading, setUser, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
