import { createSlice } from '@reduxjs/toolkit';

// Safely parse the user from local storage to prevent app crashes on corrupted data
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('sahil_user');
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (err) {
    console.error("Sahil Rent Pay: Failed to parse user from local storage.", err);
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    token: localStorage.getItem('sahil_access_token') || null,
    isAuthenticated: !!localStorage.getItem('sahil_access_token'),
  },
  reducers: {
    /**
     * Dispatched upon successful login, registration, or activation.
     * Payload must contain the decoded user object (with role_type) and the JWT access_token.
     */
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      
      // Persist to local storage using namespaced keys
      localStorage.setItem('sahil_access_token', access_token);
      localStorage.setItem('sahil_user', JSON.stringify(user));
    },
    
    /**
     * Clears the Redux state and wipes the browser's local storage.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('sahil_access_token');
      localStorage.removeItem('sahil_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// --- Global Selectors for use in UI Components & Protected Routes ---
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Direct selector for RBAC (Role-Based Access Control)
export const selectCurrentRole = (state) => state.auth.user?.role_type || null;