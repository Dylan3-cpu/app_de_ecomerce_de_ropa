function formatearPrecioCOP(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio)
}

document.addEventListener("DOMContentLoaded", () => {
  const contenedorCarrito = document.getElementById("contenedor-carrito")
  const btnPagar = document.getElementById("btn-pagar")

  const carrito = JSON.parse(localStorage.getItem("carrito")) || []

  renderCarrito(carrito)
  actualizarTotales(carrito)
  configurarEventosCarrito()
  configurarModalPago()
})

function renderCarrito(carrito) {
  const contenedorCarrito = document.getElementById("contenedor-carrito")
  contenedorCarrito.innerHTML = ""

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = "<p class='carrito-vacio'>Tu carrito está vacío</p>"
    return
  }

  carrito.forEach((producto, index) => {
    const div = document.createElement("div")
    div.className = "producto-carrito"
    div.dataset.index = index

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
        <p>${formatearPrecioCOP(producto.precio * producto.cantidad)}</p>
      </div>
    `

    contenedorCarrito.appendChild(div)
  })
}

function actualizarTotales(carrito) {
  const subtotal = carrito.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad
  }, 0)

  const envio = subtotal > 100000 ? 0 : 15000
  const total = subtotal + envio

  document.getElementById("subtotal").textContent = formatearPrecioCOP(subtotal)
  document.getElementById("envio").textContent = formatearPrecioCOP(envio)
  document.getElementById("total").textContent = formatearPrecioCOP(total)
}

function configurarEventosCarrito() {
  const contenedorCarrito = document.getElementById("contenedor-carrito")

  contenedorCarrito.addEventListener("click", (e) => {
    const index = e.target.closest(".producto-carrito")?.dataset.index
    if (index === undefined) return

    const carrito = JSON.parse(localStorage.getItem("carrito")) || []

    if (e.target.classList.contains("btn-menos")) {
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--
      }
    } else if (e.target.classList.contains("btn-mas")) {
      carrito[index].cantidad++
    } else if (e.target.classList.contains("eliminar-producto")) {
      carrito.splice(index, 1)
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderCarrito(carrito)
    actualizarTotales(carrito)
  })
}

function configurarModalPago() {
  const modal = document.getElementById("modal-pago")
  const btnPagar = document.getElementById("btn-pagar")
  const btnCerrar = document.querySelector(".modal-cerrar")
  const formPago = document.getElementById("form-pago")

  btnPagar.addEventListener("click", () => {
    const perfil = JSON.parse(localStorage.getItem("perfil")) || {}
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []

    if (carrito.length === 0) {
      alert("Tu carrito está vacío")
      return
    }

    if (!perfil.nombre || !perfil.direccion) {
      alert("Por favor completa tu perfil antes de realizar la compra")
      window.location.href = "perfil.html"
      return
    }

    const datosPerfil = document.getElementById("datos-perfil")
    datosPerfil.innerHTML = `
      <p><strong>Nombre:</strong> ${perfil.nombre}</p>
      <p><strong>Correo:</strong> ${perfil.correo || "No especificado"}</p>
      <p><strong>Teléfono:</strong> ${perfil.telefono || "No especificado"}</p>
      <p><strong>Dirección:</strong> ${perfil.direccion}</p>
      <p><strong>Ciudad:</strong> ${perfil.ciudad || "No especificada"}</p>
    `

    const resumenVentana = document.getElementById("resumen-ventana")
    const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
    const envio = subtotal > 100000 ? 0 : 15000
    const total = subtotal + envio

    resumenVentana.innerHTML = `
      <p><strong>Subtotal:</strong> ${formatearPrecioCOP(subtotal)}</p>
      <p><strong>Envío:</strong> ${formatearPrecioCOP(envio)}</p>
      <p><strong>Total:</strong> ${formatearPrecioCOP(total)}</p>
    `

    modal.style.display = "flex"
  })

  btnCerrar.addEventListener("click", () => {
    modal.style.display = "none"
  })

  const btnFinalizar = document.querySelector(".btn-finalizar")
  btnFinalizar.addEventListener("click", () => {
    const mensajeExito = document.getElementById("mensaje-exito")
    modal.style.display = "none"
    mensajeExito.style.display = "flex"

    setTimeout(() => {
      mensajeExito.style.display = "none"
      localStorage.removeItem("carrito")
      renderCarrito([])
      actualizarTotales([])
    }, 2000)
  })

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}
