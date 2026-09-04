import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'  // 👈 IMPORTA EL PROVIDER
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>          {/* 👈 ENVUELVE APP CON EL PROVIDER */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)