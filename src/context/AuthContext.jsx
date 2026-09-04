import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  // Configurar axios para incluir el token en todas las peticiones
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Decodificar token para obtener información del usuario
      try {
        const decoded = jwtDecode(token)
        setUser({ id: decoded.user_id, username: decoded.username })
      } catch (error) {
        console.error('Token inválido:', error)
        logout()
      }
    } else {
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
    }
    setLoading(false)
  }, [token])

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      })
      
      const { access, refresh } = response.data
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      setToken(access)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error de autenticación'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  const register = async (username, email, password) => {
    try {
      // Django no tiene un endpoint de registro por defecto, lo crearemos
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
      const response = await axios.post(`${API_URL}token/`, {
        username,
        email,
        password
      })
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.username?.[0] || 'Error al registrarse'
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}