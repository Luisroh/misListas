import './ModalConfirmar.css'

function ModalConfirmar({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  producto, 
  mensaje = '¿Seguro que quieres eliminar este producto?'
}) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icono">🗑️</div>
        <h2 className="modal-titulo">Confirmar eliminación</h2>
        <p className="modal-mensaje">{mensaje}</p>
        {producto && <p className="modal-producto">"{producto}"</p>}
        
        <div className="modal-botones">
          <button className="modal-boton cancelar" onClick={onCancel}>
            Cancelar
          </button>
          <button className="modal-boton confirmar" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmar