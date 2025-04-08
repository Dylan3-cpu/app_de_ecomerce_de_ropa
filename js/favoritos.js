function formatearPrecioCOP(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio)
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

    div.innerHTML = `
  <img src="${producto.imagen.replace("./", "../")}" alt="${producto.nombre}">
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
