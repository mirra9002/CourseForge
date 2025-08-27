import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null, status: 'guest'},
  reducers: {
    login(state, action) {
      state.status = 'authed'
      state.user = action.payload
    },
    logout(state, action) {
      state.status = 'guest',
      state.user = null
    }
  }
})
export const {login, logout} = authSlice.actions
export default authSlice.reducer;
