import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  
  const { login, register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    let result
    if (isRegister) {
      result = await register(username, email, password)
    } else {
      result = await login(username, password)
    }
    
    if (result.success) {
      onSuccess()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icono">🛒</span>
          <h1>Lista de la Compra</h1>
          <p className="login-subtitulo">
            {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          
          {isRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          )}
          
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn">
            {isRegister ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="login-switch-btn"
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login