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
  // Verificar la imagen del detalle
  const detalleImg = document.getElementById("detalle-img")
  verificarImagen(detalleImg)

  const producto = JSON.parse(localStorage.getItem("productoDetalle")) || {
    id: 1,
    nombre: "Vestido Floral Verano",
    categoria: "dress",
    precio: 159960,
    rating: 4.5,
    imagen: "../img/vestido1.jpg",
    descripcion: "Vestido floral de verano con corte A. 100% algodón orgánico.",
  }

  // Corregir la ruta de la imagen
  let imagenPath = producto.imagen
  if (!imagenPath.startsWith("../")) {
    imagenPath = "../" + imagenPath
  }
  document.getElementById("detalle-img").src = imagenPath
  verificarImagen(document.getElementById("detalle-img"))

  document.querySelector(".titulo-producto").textContent = producto.nombre
  document.querySelector(".detalle-rating span:nth-child(2)").textContent = producto.rating
  document.querySelector(".descripcion").textContent = producto.descripcion
  document.querySelector(".precio-producto").textContent = formatearPrecioCOP(producto.precio)

  const btnMenos = document.querySelector(".menos")
  const btnMas = document.querySelector(".mas")
  const cantidad = document.querySelector(".cantidad")
  const precioProducto = document.querySelector(".precio-producto")
  let contador = 1
  const precioUnitario = producto.precio

  function actualizarPrecio() {
    const total = precioUnitario * contador
    precioProducto.textContent = formatearPrecioCOP(total)
  }

  btnMenos.addEventListener("click", () => {
    if (contador > 1) {
      contador--
      cantidad.textContent = contador
      actualizarPrecio()
    }
  })

  btnMas.addEventListener("click", () => {
    contador++
    cantidad.textContent = contador
    actualizarPrecio()
  })

  const tallas = document.querySelectorAll(".tallas button")
  const colores = document.querySelectorAll(".color-option")

  tallas.forEach((talla) => {
    talla.addEventListener("click", () => {
      tallas.forEach((t) => t.classList.remove("activo"))
      talla.classList.add("activo")
    })
  })

  colores.forEach((color) => {
    color.addEventListener("click", () => {
      colores.forEach((c) => c.classList.remove("activo"))
      color.classList.add("activo")
    })
  })

  const btnFav = document.querySelector(".btn-fav")
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []

  if (favoritos.some((fav) => fav.id === producto.id)) {
    btnFav.classList.add("active")
    btnFav.textContent = "favorite"
  } else {
    btnFav.textContent = "favorite_border"
  }

  btnFav.addEventListener("click", () => {
    btnFav.classList.toggle("active")

    if (btnFav.classList.contains("active")) {
      btnFav.textContent = "favorite"
      if (!favoritos.some((fav) => fav.id === producto.id)) {
        favoritos.push(producto)
      }
    } else {
      btnFav.textContent = "favorite_border"
      const index = favoritos.findIndex((fav) => fav.id === producto.id)
      if (index !== -1) {
        favoritos.splice(index, 1)
      }
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos))
  })

  // Corregir el botón de volver
  document.querySelector(".btn-volver").addEventListener("click", () => {
    // En lugar de usar window.history.back(), vamos directamente a la página principal
    window.location.href = "../index.html"
  })

  document.querySelector(".btn-carrito").addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []

    // Asegurarse de que la ruta de la imagen sea correcta
    let imagenCarrito = producto.imagen
    if (!imagenCarrito.startsWith("../")) {
      imagenCarrito = "../" + imagenCarrito
    }

    const itemCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: precioUnitario,
      cantidad: contador,
      imagen: imagenCarrito,
      talla: document.querySelector(".tallas .activo").textContent,
      color: document.querySelector(".colores .activo").style.backgroundColor,
    }

    const itemExistente = carrito.find(
      (item) => item.id === producto.id && item.talla === itemCarrito.talla && item.color === itemCarrito.color,
    )

    if (itemExistente) {
      itemExistente.cantidad += contador
    } else {
      carrito.push(itemCarrito)
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))

    const btn = document.querySelector(".btn-carrito")
    btn.textContent = "✅ Añadido al carrito"
    btn.style.backgroundColor = "var(--success)"

    setTimeout(() => {
      btn.innerHTML = `🛒 Añadir al Carrito | <span class="precio-producto">${formatearPrecioCOP(precioUnitario * contador)}</span>`
      btn.style.backgroundColor = "var(--primary)"
    }, 2000)
  })
})
