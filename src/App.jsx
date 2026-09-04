import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './context/AuthContext'
import ModalConfirmar from './components/ModalConfirmar'
import ToastNotificacion from './components/ToastNotificacion'
import './App.css'
import Login from './components/Login'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'

function App() {
  const { user, logout } = useAuth()
  const [listas, setListas] = useState([])
  const [listaSeleccionada, setListaSeleccionada] = useState(null)
  const [items, setItems] = useState([])
  const [producto, setProducto] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [editando, setEditando] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoAEliminar, setProductoAEliminar] = useState(null)
  const [toast, setToast] = useState({
    abierto: false,
    mensaje: '',
    tipo: 'error'
  })
  const [nuevaListaNombre, setNuevaListaNombre] = useState('')
  const [mostrarCrearLista, setMostrarCrearLista] = useState(false)

  // Cargar listas al iniciar
  useEffect(() => {
    if (user) {
      cargarListas()
    }
  }, [user])

  const cargarListas = async () => {
    try {
      const response = await axios.get(`${API_URL}listas/`)
      setListas(response.data)
      if (response.data.length > 0 && !listaSeleccionada) {
        setListaSeleccionada(response.data[0])
        cargarProductos(response.data[0].id)
      }
    } catch (error) {
      console.error('Error al cargar listas:', error)
      mostrarToast('Error al cargar las listas', 'error')
    }
  }

  const cargarProductos = async (listaId) => {
    try {
      const response = await axios.get(`${API_URL}compras/?lista=${listaId}`)
      setItems(response.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  const mostrarToast = (mensaje, tipo = 'error') => {
    setToast({ abierto: true, mensaje, tipo })
  }

  const cerrarToast = () => {
    setToast({ ...toast, abierto: false })
  }

  // CREAR NUEVA LISTA
  const crearLista = async (e) => {
    e.preventDefault()
    if (!nuevaListaNombre.trim()) {
      mostrarToast('Escribe un nombre para la lista', 'warning')
      return
    }

    try {
      const response = await axios.post(`${API_URL}listas/`, {
        nombre: nuevaListaNombre.trim()
      })
      setListas([...listas, response.data])
      setListaSeleccionada(response.data)
      setItems([])
      setNuevaListaNombre('')
      setMostrarCrearLista(false)
      mostrarToast(`Lista "${response.data.nombre}" creada ✅`, 'success')
    } catch (error) {
      console.error('Error al crear lista:', error)
      mostrarToast('Error al crear la lista', 'error')
    }
  }

  // COMPARTIR LISTA
  const compartirLista = async (username) => {
    if (!listaSeleccionada) return

    try {
      await axios.post(`${API_URL}listas/${listaSeleccionada.id}/compartir/`, {
        username: username.toUpperCase()
      })
      mostrarToast(`Lista compartida con ${username} ✅`, 'success')
      cargarListas() // Recargar para actualizar la lista de compartidos
    } catch (error) {
      mostrarToast(error.response?.data?.error || 'Error al compartir', 'error')
    }
  }

  // AÑADIR PRODUCTO
  const añadirProducto = async (e) => {
    e.preventDefault()
    if (!listaSeleccionada) {
      mostrarToast('Primero selecciona o crea una lista', 'warning')
      return
    }

    if (!producto.trim() || !cantidad) {
      mostrarToast('Completa todos los campos', 'warning')
      return
    }

    try {
      const data = {
        lista: listaSeleccionada.id,
        producto: producto.trim().toUpperCase(),
        cantidad: parseInt(cantidad)
      }

      await axios.post(`${API_URL}compras/`, data)
      setProducto('')
      setCantidad('')
      cargarProductos(listaSeleccionada.id)
      mostrarToast(`"${data.producto}" añadido ✅`, 'success')
    } catch (error) {
      if (error.response?.status === 403) {
        mostrarToast('No tienes permiso para añadir a esta lista', 'error')
      } else {
        mostrarToast('Producto duplicado o inválido', 'warning')
      }
    }
  }

  // ELIMINAR PRODUCTO
  const eliminarProducto = async () => {
    if (!productoAEliminar) return

    try {
      await axios.delete(`${API_URL}compras/${productoAEliminar.id}/`)
      setModalAbierto(false)
      setProductoAEliminar(null)
      cargarProductos(listaSeleccionada.id)
      mostrarToast(`"${productoAEliminar.producto}" eliminado 🗑️`, 'success')
    } catch (error) {
      mostrarToast('Error al eliminar', 'error')
    }
  }

  // MODIFICAR CANTIDAD
  const modificarCantidad = async (id, nuevaCantidad) => {
    try {
      await axios.patch(`${API_URL}compras/${id}/`, {
        cantidad: parseInt(nuevaCantidad)
      })
      setEditando(null)
      cargarProductos(listaSeleccionada.id)
      mostrarToast('Cantidad actualizada ✅', 'success')
    } catch (error) {
      mostrarToast('Error al modificar', 'error')
    }
  }

  // MARCAR COMO COMPRADO
  const toggleCompletado = async (id, completadoActual) => {
    try {
      await axios.patch(`${API_URL}compras/${id}/`, {
        completado: !completadoActual
      })
      cargarProductos(listaSeleccionada.id)
    } catch (error) {
      mostrarToast('Error al actualizar', 'error')
    }
  }

  if (!user) {
    return <Login onSuccess={() => window.location.reload()} />
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div className="header-left">
            <span className="header-icono">🛒</span>
            <h1>Mis Listas</h1>
          </div>
          <div className="header-right">
            <span className="usuario">{user.username}</span>
            <button onClick={logout} className="btn-logout">Cerrar sesión</button>
          </div>
        </div>
        <p className="subtitulo">Gestiona tus compras con estilo 💜</p>
      </div>

      {/* SELECTOR DE LISTAS */}
      <div className="selector-listas">
  <select 
    value={listaSeleccionada?.id || ''}
    onChange={(e) => {
      const lista = listas.find(l => l.id === parseInt(e.target.value))
      setListaSeleccionada(lista)
      if (lista) cargarProductos(lista.id)
    }}
    className="selector-select"
  >
    {listas.map(lista => (
      <option key={lista.id} value={lista.id}>
        {lista.nombre} {!lista.es_propietario && '(compartida)'}
      </option>
    ))}
  </select>
  
  <button 
    onClick={() => setMostrarCrearLista(!mostrarCrearLista)}
    className="btn-crear-lista"
  >
    + Nueva
  </button>
</div>

      {/* CREAR NUEVA LISTA */}
      {mostrarCrearLista && (
        <form onSubmit={crearLista} className="crear-lista-form">
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={nuevaListaNombre}
            onChange={(e) => setNuevaListaNombre(e.target.value.toUpperCase())}
            className="input-producto"
          />
          <button type="submit" className="btn-anadir">Crear</button>
          <button 
            type="button" 
            onClick={() => setMostrarCrearLista(false)}
            className="btn-cancelar"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* COMPARTIR LISTA */}
      {listaSeleccionada?.es_propietario && (
        <div className="compartir-lista">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              const username = e.target.username.value
              if (username) compartirLista(username)
              e.target.username.value = ''
            }}
            className="compartir-form"
          >
            <input
              type="text"
              name="username"
              placeholder="Compartir con (username)"
              className="input-compartir"
            />
            <button type="submit" className="btn-compartir">👥 Compartir</button>
          </form>
          {listaSeleccionada?.compartido_con_usuarios?.length > 0 && (
            <div className="usuarios-compartidos">
              <span>Compartida con: </span>
              {listaSeleccionada.compartido_con_usuarios.map(u => (
                <span key={u} className="usuario-tag">@{u}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FORMULARIO AÑADIR PRODUCTO */}
      <form onSubmit={añadirProducto} className="form">
        <input
          type="text"
          placeholder="¿Qué producto necesitas?"
          value={producto}
          onChange={(e) => setProducto(e.target.value.toUpperCase())}
          className="input-producto"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="input-cantidad"
        />
        <button type="submit" className="btn-anadir">
          + Añadir
        </button>
      </form>

      {/* CONTADOR */}
      <div className="contador">
        {items.length === 0 ? (
          <span className="vacio">📭 La lista está vacía</span>
        ) : (
          <span>
            {items.filter(i => !i.completado).length} pendientes · 
            {items.filter(i => i.completado).length} comprados
          </span>
        )}
      </div>

      {/* LISTA DE PRODUCTOS */}
      {items.length > 0 && (
        <ul className="lista">
          {items.map((item) => (
            <li key={item.id} className={`item-lista ${item.completado ? 'completado' : ''}`}>
              <div className="item-info">
                <input
                  type="checkbox"
                  checked={item.completado}
                  onChange={() => toggleCompletado(item.id, item.completado)}
                  className="item-checkbox"
                />
                <span className="item-nombre">{item.producto}</span>
              </div>
              
              {editando === item.id ? (
                <div className="edicion">
                  <input
                    type="number"
                    defaultValue={item.cantidad}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        modificarCantidad(item.id, e.target.value)
                      }
                      if (e.key === 'Escape') {
                        setEditando(null)
                      }
                    }}
                    autoFocus
                    className="input-editar"
                  />
                  <button 
                    onClick={() => setEditando(null)} 
                    className="btn-cancelar"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="item-acciones">
                  <span className="item-cantidad">× {item.cantidad}</span>
                  <button 
                    onClick={() => setEditando(item.id)} 
                    className="btn-edit"
                    title="Modificar cantidad"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => {
                      setProductoAEliminar(item)
                      setModalAbierto(true)
                    }} 
                    className="btn-delete"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ModalConfirmar
        isOpen={modalAbierto}
        onConfirm={eliminarProducto}
        onCancel={() => {
          setModalAbierto(false)
          setProductoAEliminar(null)
        }}
        producto={productoAEliminar?.producto}
        mensaje="¿Estás seguro de que quieres eliminar este producto de tu lista?"
      />

      <ToastNotificacion
        isOpen={toast.abierto}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onClose={cerrarToast}
        duracion={3000}
      />
    </div>
  )
}

export default App