/**
 * =============================================
 * FUNCIONALIDAD GENERAL (script.js)
 * Maneja la lógica común del sitio web
 * =============================================
 */

/**
 * Alterna la visibilidad del menú de secciones
 */
function toggleMenu() {
    console.log("Clic en menú");
    const menu = document.getElementById("menu-secciones");
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
}

/**
 * Cierra el menú al hacer clic fuera de él
 */
document.addEventListener('click', function (e) {
    const menu = document.getElementById("menu-secciones");
    const btn = document.querySelector(".btn-categorias");

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = "none";
    }
});

/**
 * =============================================
 * FUNCIONALIDAD DEL CARRUSEL DE PRODUCTOS
 * =============================================
 */

/**
 * Mueve el carrusel en la dirección especificada
 * @param {string} idCarrusel - ID del carrusel a mover
 * @param {number} direccion - 1 para derecha, -1 para izquierda
 */
function moverCarrusel(idCarrusel, direccion) {
    const carrusel = document.getElementById(idCarrusel);
    const items = carrusel.querySelectorAll('.item');
    const visibles = 3;
    const anchoItem = items[0].offsetWidth + 20;
    const totalItems = items.length;
    const maxScroll = (totalItems - visibles) * anchoItem;

    let posicion = parseInt(carrusel.dataset.posicion || 0);
    posicion += direccion * anchoItem;

    // Limitar movimiento
    if (posicion < 0) posicion = 0;
    if (posicion > maxScroll) posicion = maxScroll;

    // Aplicar movimiento
    carrusel.style.transform = `translateX(-${posicion}px)`;
    carrusel.dataset.posicion = posicion;
}