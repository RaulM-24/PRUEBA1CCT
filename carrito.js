/**
 * =============================================
 * CARRITO DE COMPRAS (carrito.js) - VERSIÓN CORREGIDA
 * =============================================
 */

const Carrito = {
  productos: [],
  total: 0,

  init: function() {
    const carritoGuardado = localStorage.getItem('carritoCCT');
    if (carritoGuardado) {
      const {productos, total} = JSON.parse(carritoGuardado);
      this.productos = productos;
      this.total = total;
      this.actualizarUI();
    }
  },

  guardarEnLocalStorage: function() {
    localStorage.setItem('carritoCCT', JSON.stringify({
      productos: this.productos,
      total: this.total
    }));
  },

  agregarProducto: function(producto) {
    const existenteIndex = this.productos.findIndex(p => p.id === producto.id);
    
    if (existenteIndex >= 0) {
      this.productos[existenteIndex].cantidad++;
    } else {
      this.productos.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
    
    this.actualizarTotal();
  },

  actualizarTotal: function() {
    this.total = this.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    this.actualizarUI();
    this.guardarEnLocalStorage();
  },

  actualizarUI: function() {
    // Actualizar barra inferior
    const totalElemento = document.querySelector('.total-texto');
    if (totalElemento) totalElemento.textContent = `$${this.total.toFixed(2)}`;
    
    // Actualizar contador
    const contador = document.getElementById('contador-carrito');
    if (contador) {
      const totalItems = this.productos.reduce((sum, p) => sum + p.cantidad, 0);
      contador.textContent = totalItems;
    }
  },

  eliminarProducto: function(index) {
    if (index >= 0 && index < this.productos.length) {
      this.productos.splice(index, 1);
      this.actualizarTotal();
      return true;
    }
    return false;
  },

  actualizarCantidad: function(index, action) {
    if (index >= 0 && index < this.productos.length) {
      const producto = this.productos[index];
      
      if (action === 'incrementar') {
        producto.cantidad++;
      } else if (action === 'decrementar' && producto.cantidad > 1) {
        producto.cantidad--;
      }
      
      this.actualizarTotal();
      return true;
    }
    return false;
  },

  vaciarCarrito: function() {
    this.productos = [];
    this.total = 0;
    this.actualizarUI();
    localStorage.removeItem('carritoCCT');
  }
};

/**
 * Actualiza el modal del carrito (versión simplificada)
 */
function actualizarModalCarrito() {
  const listaCarrito = document.getElementById('lista-carrito');
  const totalModal = document.getElementById('total-modal');
  
  if (!listaCarrito || !totalModal) return;

  listaCarrito.innerHTML = '';
  
  Carrito.productos.forEach((producto, index) => {
    const item = document.createElement('div');
    item.className = 'item-carrito';
    item.innerHTML = `
      <div class="item-info">
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio.toFixed(2)}</p>
      </div>
      <div class="item-controles">
        <button class="btn-cantidad" data-index="${index}" data-action="decrementar">-</button>
        <span>${producto.cantidad}</span>
        <button class="btn-cantidad" data-index="${index}" data-action="incrementar">+</button>
        <button class="btn-eliminar" data-index="${index}">Eliminar</button>
      </div>
    `;
    listaCarrito.appendChild(item);
  });
  
  totalModal.textContent = `$${Carrito.total.toFixed(2)}`;
}

/**
 * Configuración de eventos del carrito
 */
function configurarEventosCarrito() {
  // Delegación de eventos para el modal
  document.addEventListener('click', function(e) {
    // Botones +/-
    if (e.target.classList.contains('btn-cantidad')) {
      const index = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;
      
      if (Carrito.actualizarCantidad(index, action)) {
        actualizarModalCarrito();
      }
    }
    
    // Botones eliminar
    else if (e.target.classList.contains('btn-eliminar')) {
      const index = parseInt(e.target.dataset.index);
      
      if (Carrito.eliminarProducto(index)) {
        actualizarModalCarrito();
      }
    }
  });

  // Botón vaciar carrito
  document.getElementById('vaciar-carrito')?.addEventListener('click', function() {
    Carrito.vaciarCarrito();
    actualizarModalCarrito();
  });

  // Botón abrir modal
  document.getElementById('btn-ver-carrito')?.addEventListener('click', function() {
    actualizarModalCarrito();
    document.getElementById('modal-carrito').style.display = 'block';
  });

  // Botón cerrar modal
  document.querySelector('.cerrar-modal')?.addEventListener('click', function() {
    document.getElementById('modal-carrito').style.display = 'none';
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  Carrito.init();
  configurarEventosCarrito();
  
  // Configurar botones "Agregar al carrito"
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', function() {
      const producto = {
        id: this.dataset.id,
        nombre: this.dataset.nombre,
        precio: parseFloat(this.dataset.precio)
      };
      
      Carrito.agregarProducto(producto);
      
      // Feedback visual
      const originalText = this.innerHTML;
      this.innerHTML = '✓ Agregado';
      setTimeout(() => this.innerHTML = originalText, 2000);
    });
  });
});

/**
 * =============================================
 * CARRITO DE COMPRAS (carrito.js) - VERSIÓN FINAL
 * =============================================
 */

// ... (todo tu código existente se mantiene igual hasta la línea 180)

// ========== SISTEMA DE QR Y PAGOS ==========

/**
 * Genera un código QR en el contenedor especificado
 * @param {string} contenedorId - ID del elemento donde se generará el QR
 */
function generarQR(contenedorId) {
  const qrContainer = document.getElementById(contenedorId);
  if (!qrContainer) return;
  
  qrContainer.innerHTML = '';
  
  // Datos para el QR: NombreTienda|Total|Fecha|IDÚnico
  const datosQR = `CCT|${Carrito.total.toFixed(2)}|${new Date().toLocaleDateString()}|${Date.now()}`;
  
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
 * Configura todos los eventos relacionados con el QR y pagos
 */
function configurarEventosQR() {
  const modalQR = document.getElementById('modal-qr');
  const modalConfirmacion = document.getElementById('modal-confirmacion');
  const modalPagoTienda = document.getElementById('modal-pago-tienda');
  
  // 1. Abrir modal QR principal al hacer clic en botón QR
  document.querySelector('.btn-qr')?.addEventListener('click', function() {
    if (Carrito.productos.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    generarQR('codigo-qr');
    document.getElementById('total-qr').textContent = `$${Carrito.total.toFixed(2)}`;
    modalQR.style.display = 'block';
  });

  // 2. Cerrar modal QR
  document.querySelector('.cerrar-modal-qr')?.addEventListener('click', function() {
    modalQR.style.display = 'none';
  });

  // 3. Botón "Aceptar" en modal QR (va a confirmación)
  document.getElementById('btn-aceptar-qr')?.addEventListener('click', function() {
    modalQR.style.display = 'none';
    modalConfirmacion.style.display = 'block';
  });

  // 4. Opción "Pago en tienda" (nuevo modal con QR)
  document.getElementById('btn-presencial')?.addEventListener('click', function() {
    modalConfirmacion.style.display = 'none';

     // 6. Cerrar modal de Pago en Tienda con la tacha
  document.querySelector('.cerrar-modal-pago')?.addEventListener('click', function() {
    modalPagoTienda.style.display = 'none';
  });
    
    // Generar QR específico para pago en tienda
    generarQR('qr-pago-tienda');
    document.getElementById('total-pago-tienda').textContent = `$${Carrito.total.toFixed(2)}`;
    
    modalPagoTienda.style.display = 'block';
  });

  // 5. Opción "Transferencia" (simulada)
  document.getElementById('btn-transferencia')?.addEventListener('click', function() {
    modalConfirmacion.style.display = 'none';
    alert('Redirigiendo a portal de transferencias...');
    // Lógica real iría aquí
  });

  // 6. Cerrar modal de Pago en Tienda
  document.getElementById('btn-cerrar-pago')?.addEventListener('click', function() {
    modalPagoTienda.style.display = 'none';
  });

  // Cerrar modales al hacer clic fuera
  window.addEventListener('click', function(event) {
    if (event.target === modalQR) modalQR.style.display = 'none';
    if (event.target === modalConfirmacion) modalConfirmacion.style.display = 'none';
    if (event.target === modalPagoTienda) modalPagoTienda.style.display = 'none';
  });
}

// Inicialización (al final del archivo)
document.addEventListener('DOMContentLoaded', function() {
  Carrito.init();
  configurarEventosCarrito();
  configurarEventosQR(); // <-- Añadir esta línea
  
  // Configurar botones "Agregar al carrito" (tu código existente)
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', function() {
      const producto = {
        id: this.dataset.id,
        nombre: this.dataset.nombre,
        precio: parseFloat(this.dataset.precio)
      };
      
      Carrito.agregarProducto(producto);
      
      // Feedback visual
      const originalText = this.innerHTML;
      this.innerHTML = '✓ Agregado';
      setTimeout(() => this.innerHTML = originalText, 2000);
    });
  });
});