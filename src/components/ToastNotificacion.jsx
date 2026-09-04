import { useEffect } from 'react'
import './ToastNotificacion.css'

function ToastNotificacion({ 
  isOpen, 
  mensaje, 
  tipo = 'error',  // 'error' | 'success' | 'warning'
  onClose,
  duracion = 3000  // 3 segundos por defecto
}) {
  
  useEffect(() => {
    if (isOpen && duracion > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duracion)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duracion, onClose])

  if (!isOpen) return null

  const iconos = {
    error: '❌',
    success: '✅',
    warning: '⚠️'
  }

  return (
    <div className={`toast-overlay ${tipo}`}>
      <div className="toast-contenido">
        <span className="toast-icono">{iconos[tipo] || '📢'}</span>
        <p className="toast-mensaje">{mensaje}</p>
        <button className="toast-cerrar" onClick={onClose}>×</button>
      </div>
    </div>
  )
}

export default ToastNotificacion