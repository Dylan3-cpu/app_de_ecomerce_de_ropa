function formatearPrecioCOP(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio)
}

// Función para verificar si una imagen existe
function verificarImagen(img) {
  img.onerror = function () {
    console.error("Error cargando imagen:", this.src)
    // Intentar con una ruta alternativa
    if (this.src.includes("img/")) {
      this.src = this.src.replace("img/", "storage/img/")
    } else if (this.src.includes("storage/img/")) {
      this.src = this.src.replace("storage/img/", "img/")
    } else {
      this.src = "../storage/img/user.png" // Imagen de respaldo
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const contenedorFavoritos = document.getElementById("contenedor-favoritos")

  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

  renderFavoritos(favoritos)
  configurarEventosFavoritos()
})

function renderFavoritos(favoritos) {
  const contenedorFavoritos = document.getElementById("contenedor-favoritos")
  contenedorFavoritos.innerHTML = ""

  if (favoritos.length === 0) {
    contenedorFavoritos.innerHTML = `
      <div class="favoritos-vacio">
        <p>No tienes productos favoritos aún</p>
        <a href="../index.html">Explorar productos</a>
      </div>
    `
    return
  }

  favoritos.forEach((producto, index) => {
    const div = document.createElement("div")
    div.className = "producto"
    div.dataset.id = producto.id

    // Corregir la ruta de la imagen
    let imagenPath = producto.imagen
    if (!imagenPath.startsWith("../")) {
      imagenPath = "../" + imagenPath
    }

    div.innerHTML = `
      <img src="${imagenPath}" alt="${producto.nombre}" onerror="this.onerror=null; this.src='../storage/img/user.png';">
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <div class="precio-rating">
          <span>${formatearPrecioCOP(producto.precio)}</span>
          <span>⭐ ${producto.rating}</span>
        </div>
      </div>
      <div class="icono-corazon">❤️</div>
    `

    // Verificar la imagen del producto
    const img = div.querySelector("img")
    verificarImagen(img)

    contenedorFavoritos.appendChild(div)
  })
}

function configurarEventosFavoritos() {
  const contenedorFavoritos = document.getElementById("contenedor-favoritos")

  contenedorFavoritos.addEventListener("click", (e) => {
    if (e.target.closest(".icono-corazon")) {
      const productoId = e.target.closest(".producto").dataset.id
      let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

      favoritos = favoritos.filter((p) => p.id != productoId)
      localStorage.setItem("favoritos", JSON.stringify(favoritos))

      renderFavoritos(favoritos)
    }

    if (e.target.closest(".producto") && !e.target.closest(".icono-corazon")) {
      const productoId = e.target.closest(".producto").dataset.id
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
      const producto = favoritos.find((p) => p.id == productoId)

      if (producto) {
        localStorage.setItem("productoDetalle", JSON.stringify(producto))
        window.location.href = "detail.html"
      }
    }
  })
}
