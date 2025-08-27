import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';

export const store = configureStore({ reducer: { auth }});

// // simple persistence
// store.subscribe(() => {
//   try {
//     const state = store.getState().auth;
//     localStorage.setItem('authState', JSON.stringify(state));
//   } catch {}
// });
