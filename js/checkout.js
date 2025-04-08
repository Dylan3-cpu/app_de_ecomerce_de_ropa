document.addEventListener("DOMContentLoaded", () => {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    const btnPagar = document.getElementById("btn-pagar");
    
    // Cargar carrito
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Mostrar productos del carrito
    renderCarrito(carrito);
    
    // Calcular totales
    actualizarTotales(carrito);
    
    // Configurar eventos
    configurarEventosCarrito();
    
    // Configurar modal de pago
    configurarModalPago();
  });
  
  function renderCarrito(carrito) {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    contenedorCarrito.innerHTML = "";
    
    if (carrito.length === 0) {
      contenedorCarrito.innerHTML = "<p class='carrito-vacio'>Tu carrito está vacío</p>";
      return;
    }
    
    carrito.forEach((producto, index) => {
      const div = document.createElement("div");
      div.className = "producto-carrito";
      div.dataset.index = index;
      
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="info-carrito">
          <h3>${producto.nombre}</h3>
          <p>Talla: ${producto.talla} | Color: <span class="color-muestra" style="background-color:${producto.color}"></span></p>
          <div class="controles-carrito">
            <button class="btn-menos">-</button>
            <span>${producto.cantidad}</span>
            <button class="btn-mas">+</button>
            <button class="eliminar-producto">Eliminar</button>
          </div>
          <p>$${(producto.precio * producto.cantidad).toFixed(2)}</p>
        </div>
      `;
      
      contenedorCarrito.appendChild(div);
    });
  }
  
  function actualizarTotales(carrito) {
    const subtotal = carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
    
    const envio = subtotal > 100 ? 0 : 5.99;
    const total = subtotal + envio;
    
    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("envio").textContent = `$${envio.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }
  
  function configurarEventosCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    
    contenedorCarrito.addEventListener("click", (e) => {
      const index = e.target.closest(".producto-carrito")?.dataset.index;
      if (index === undefined) return;
      
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      
      if (e.target.classList.contains("btn-menos")) {
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        }
      } else if (e.target.classList.contains("btn-mas")) {
        carrito[index].cantidad++;
      } else if (e.target.classList.contains("eliminar-producto")) {
        carrito.splice(index, 1);
      }
      
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito(carrito);
      actualizarTotales(carrito);
    });
  }
  
  function configurarModalPago() {
    const modal = document.getElementById("modal-pago");
    const btnPagar = document.getElementById("btn-pagar");
    const btnCerrar = document.querySelector(".modal-cerrar");
    const formPago = document.getElementById("form-pago");
    
    btnPagar.addEventListener("click", () => {
      modal.style.display = "flex";
    });
    
    btnCerrar.addEventListener("click", () => {
      modal.style.display = "none";
    });
    
    formPago.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Simular procesamiento de pago
      setTimeout(() => {
        alert("Pago procesado con éxito");
        localStorage.removeItem("carrito");
        modal.style.display = "none";
        renderCarrito([]);
        actualizarTotales([]);
      }, 1500);
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }