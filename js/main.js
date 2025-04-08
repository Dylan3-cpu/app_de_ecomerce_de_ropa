function formatearPrecioCOP(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(precio)
}

const productos = [
  {
    id: 1,
    nombre: "Vestido Floral Verano",
    categoria: "dress",
    precio: 159960,
    rating: 4.5,
    imagen: "img/vestido1.jpg",
    descripcion: "Vestido floral de verano con corte A. 100% algodón orgánico.",
  },
  {
    id: 2,
    nombre: "Camiseta Básica Blanca",
    categoria: "tshirt",
    precio: 79960,
    rating: 4.2,
    imagen: "img/camiseta1.jpg",
    descripcion: "Camiseta básica de algodón. Corte clásico y cómodo.",
  },
  {
    id: 3,
    nombre: "Jeans Slim Fit",
    categoria: "jeans",
    precio: 199960,
    rating: 4.7,
    imagen: "img/jeans1.jpg",
    descripcion: "Jeans ajustados con elastano para mayor comodidad.",
  },
  {
    id: 4,
    nombre: "Vestido Negro Elegante",
    categoria: "dress",
    precio: 239960,
    rating: 4.8,
    imagen: "img/vestido2.jpg",
    descripcion: "Vestido negro para ocasiones especiales. Corte midi.",
  },
  {
    id: 5,
    nombre: "Camiseta Oversized",
    categoria: "tshirt",
    precio: 99960,
    rating: 4.3,
    imagen: "img/camiseta2.jpg",
    descripcion: "Camiseta oversized de corte moderno. Varios colores.",
  },
  {
    id: 6,
    nombre: "Jeans Mom Fit",
    categoria: "jeans",
    precio: 219960,
    rating: 4.6,
    imagen: "img/jeans2.jpg",
    descripcion: "Jeans estilo mom fit. Tiro alto y ajuste perfecto.",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  const contenedorProductos = document.getElementById("contenedor-productos")
  const inputBusqueda = document.querySelector(".busqueda input")
  const filtroBotones = document.querySelectorAll(".filtros button")

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {}
  if (usuario.nombre) {
    document.getElementById("nombre-usuario").textContent = usuario.nombre
  }
  if (usuario.imagen) {
    document.getElementById("imagen-perfil").src = usuario.imagen
  } else {
    document.getElementById("imagen-perfil").src = "storage/img/user.png"
  }

  function renderProductos(productosMostrar) {
    contenedorProductos.innerHTML = ""

    if (productosMostrar.length === 0) {
      contenedorProductos.innerHTML = `
        <div class="sin-productos">
          <p>No se encontraron productos</p>
        </div>
      `
      return
    }

    productosMostrar.forEach((producto) => {
      const div = document.createElement("div")
      div.className = "producto"
      div.dataset.categoria = producto.categoria
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p>${producto.categoria}</p>
          <div class="precio-rating">
            <span>${formatearPrecioCOP(producto.precio)}</span>
            <span>⭐ ${producto.rating}</span>
          </div>
        </div>
        <div class="icono-corazon">🤍</div>
      `

      div.addEventListener("click", (e) => {
        if (e.target.closest(".icono-corazon")) {
          e.stopPropagation()
          const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
          const existe = favoritos.some((fav) => fav.id === producto.id)

          if (existe) {
            const nuevosFavoritos = favoritos.filter((fav) => fav.id !== producto.id)
            localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos))
            e.target.closest(".icono-corazon").textContent = "🤍"
          } else {
            favoritos.push(producto)
            localStorage.setItem("favoritos", JSON.stringify(favoritos))
            e.target.closest(".icono-corazon").textContent = "❤️"
          }
          return
        }

        localStorage.setItem("productoDetalle", JSON.stringify(producto))
        window.location.href = "views/detail.html"
      })

      // Verificar si está en favoritos
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
      if (favoritos.some((fav) => fav.id === producto.id)) {
        div.querySelector(".icono-corazon").textContent = "❤️"
      }

      contenedorProductos.appendChild(div)
    })
  }

  filtroBotones.forEach((boton) => {
    boton.addEventListener("click", () => {
      filtroBotones.forEach((btn) => btn.classList.remove("activo"))
      boton.classList.add("activo")

      const filtro = boton.dataset.filtro
      const productosFiltrados = filtro === "all" ? productos : productos.filter((p) => p.categoria === filtro)

      renderProductos(productosFiltrados)
    })
  })

  inputBusqueda.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase()
    const productosFiltrados = productos.filter(
      (p) => p.nombre.toLowerCase().includes(termino) || p.categoria.toLowerCase().includes(termino),
    )
    renderProductos(productosFiltrados)
  })

  renderProductos(productos)
})
