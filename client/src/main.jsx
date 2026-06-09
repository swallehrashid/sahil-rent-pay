import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// --- Redux Imports ---
import { Provider } from 'react-redux'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* The Provider wraps the entire application, making the Redux store 
      (and our RTK Query apiSlice) available to any nested component.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)