/**
 * =============================================
 * SISTEMA DE PAGOS Y QR (QR.js)
 * =============================================
 */

/**
 * Genera un código QR en el contenedor especificado
 * @param {string} contenedorId - ID del elemento donde se generará el QR
 * @param {string} [tipo='normal'] - Tipo de QR ('normal', 'tienda' o 'transferencia')
 */
function generarQR(contenedorId, tipo = 'normal') {
  const qrContainer = document.getElementById(contenedorId);
  if (!qrContainer) return;
  
  qrContainer.innerHTML = '';
  
  // Datos para el QR basados en el tipo
  let datosQR;
  switch(tipo) {
    case 'transferencia':
      const referencia = Date.now().toString().slice(-6);
      document.getElementById('referencia').textContent = referencia;
      datosQR = `CCT-TRANS|${Carrito.total.toFixed(2)}|${referencia}|${new Date().toLocaleDateString()}`;
      break;
    case 'tienda':
      datosQR = `CCT-TIENDA|${Carrito.total.toFixed(2)}|${new Date().toLocaleDateString()}|${Date.now().toString().slice(-4)}`;
      break;
    default:
      datosQR = `CCT|${Carrito.total.toFixed(2)}|${new Date().toLocaleDateString()}|${Date.now()}`;
  }
  
  new QRCode(qrContainer, {
    text: datosQR,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
}

/**
 * Configura todos los eventos relacionados con pagos y QR
 */
function configurarEventosPagos() {
  // Referencias a todos los modales
  const modales = {
    qr: document.getElementById('modal-qr'),
    confirmacion: document.getElementById('modal-confirmacion'),
    pagoTienda: document.getElementById('modal-pago-tienda'),
    transferencia: document.getElementById('modal-transferencia')
  };

  // 1. Abrir modal QR principal
  document.querySelector('.btn-qr')?.addEventListener('click', function() {
    if (Carrito.productos.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    generarQR('codigo-qr');
    document.getElementById('total-qr').textContent = `$${Carrito.total.toFixed(2)}`;
    modales.qr.style.display = 'block';
  });

  // 2. Cerrar modales con tachas (×)
  document.querySelector('.cerrar-modal-qr')?.addEventListener('click', () => modales.qr.style.display = 'none');
  document.querySelector('.cerrar-modal-pago')?.addEventListener('click', () => modales.pagoTienda.style.display = 'none');
  document.querySelector('.cerrar-modal-transferencia')?.addEventListener('click', () => modales.transferencia.style.display = 'none');

  // 3. Botón "Aceptar" en modal QR (va a confirmación)
  document.getElementById('btn-aceptar-qr')?.addEventListener('click', function() {
    modales.qr.style.display = 'none';
    modales.confirmacion.style.display = 'block';
  });

  // 4. Opción "Pago en tienda"
  document.getElementById('btn-presencial')?.addEventListener('click', function() {
    modales.confirmacion.style.display = 'none';
    generarQR('qr-pago-tienda', 'tienda');
    document.getElementById('total-pago-tienda').textContent = `$${Carrito.total.toFixed(2)}`;
    modales.pagoTienda.style.display = 'block';
  });

  // 5. Opción "Transferencia"
  document.getElementById('btn-transferencia')?.addEventListener('click', function() {
    modales.confirmacion.style.display = 'none';
    generarQR('qr-transferencia', 'transferencia');
    document.getElementById('total-transferencia').textContent = `$${Carrito.total.toFixed(2)}`;
    modales.transferencia.style.display = 'block';
  });

  // 6. Botón "Ya pagué" en transferencia
  document.getElementById('btn-ya-pague')?.addEventListener('click', function() {
    alert('Gracias. Presenta este QR en el establecimiento para validar tu pago.');
    modales.transferencia.style.display = 'none';
    Carrito.vaciarCarrito();
  });

  // 7. Botón "Cerrar" en pago en tienda
  document.getElementById('btn-cerrar-pago')?.addEventListener('click', function() {
    modales.pagoTienda.style.display = 'none';
  });

  // 8. Botón "Cancelar" en transferencia
  document.getElementById('btn-cancelar-transferencia')?.addEventListener('click', function() {
    modales.transferencia.style.display = 'none';
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', function(event) {
    if (event.target === modales.qr) modales.qr.style.display = 'none';
    if (event.target === modales.confirmacion) modales.confirmacion.style.display = 'none';
    if (event.target === modales.pagoTienda) modales.pagoTienda.style.display = 'none';
    if (event.target === modales.transferencia) modales.transferencia.style.display = 'none';
  });
}

// Inicialización de pagos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Solo inicializar si hay elementos de pago en la página
  if (document.querySelector('.btn-qr')) {
    configurarEventosPagos();
  }
});


