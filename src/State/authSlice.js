// src/state/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const persisted = (() => {
  try { return JSON.parse(localStorage.getItem('authState')) || null; }
  catch { return null; }
})();

const initialState = persisted ?? {
  user: null,
  status: 'guest',    // sensible default instead of 'loading'
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
    resetAuth() { return { user:null, status:'guest', error:null }; },
  },
});

export const { setLoading, setUser, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
