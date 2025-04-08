document.addEventListener("DOMContentLoaded", () => {
    // Obtener producto de localStorage
    const producto = JSON.parse(localStorage.getItem("productoDetalle")) || {
      id: 1,
      nombre: "Vestido Floral Verano",
      categoria: "dress",
      precio: 39.99,
      rating: 4.5,
      imagen: "img/vestido1.jpg",
      descripcion: "Vestido floral de verano con corte A. 100% algodón orgánico."
    };
  
    // Cargar datos del producto
    document.getElementById("detalle-img").src = producto.imagen;
    document.querySelector(".titulo-producto").textContent = producto.nombre;
    document.querySelector(".detalle-rating span:nth-child(2)").textContent = producto.rating;
    document.querySelector(".descripcion").textContent = producto.descripcion;
    document.querySelector(".precio-producto").textContent = `$${producto.precio.toFixed(2)}`;
  
    // Control de cantidad
    const btnMenos = document.querySelector(".menos");
    const btnMas = document.querySelector(".mas");
    const cantidad = document.querySelector(".cantidad");
    const precioProducto = document.querySelector(".precio-producto");
    let contador = 1;
    let precioUnitario = producto.precio;
  
    function actualizarPrecio() {
      const total = (precioUnitario * contador).toFixed(2);
      precioProducto.textContent = `$${total}`;
    }
  
    btnMenos.addEventListener("click", () => {
      if (contador > 1) {
        contador--;
        cantidad.textContent = contador;
        actualizarPrecio();
      }
    });
  
    btnMas.addEventListener("click", () => {
      contador++;
      cantidad.textContent = contador;
      actualizarPrecio();
    });
  
    // Selectores de talla y color
    const tallas = document.querySelectorAll(".tallas button");
    const colores = document.querySelectorAll(".color-option");
  
    tallas.forEach(talla => {
      talla.addEventListener("click", () => {
        tallas.forEach(t => t.classList.remove("activo"));
        talla.classList.add("activo");
      });
    });
  
    colores.forEach(color => {
      color.addEventListener("click", () => {
        colores.forEach(c => c.classList.remove("activo"));
        color.classList.add("activo");
      });
    });
  
    // Botón de favoritos
    const btnFav = document.querySelector(".btn-fav");
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
    // Verificar si el producto está en favoritos
    if (favoritos.some(fav => fav.id === producto.id)) {
      btnFav.classList.add("active");
    }
  
    btnFav.addEventListener("click", () => {
      btnFav.classList.toggle("active");
      
      if (btnFav.classList.contains("active")) {
        // Añadir a favoritos
        if (!favoritos.some(fav => fav.id === producto.id)) {
          favoritos.push(producto);
        }
      } else {
        // Quitar de favoritos
        const index = favoritos.findIndex(fav => fav.id === producto.id);
        if (index !== -1) {
          favoritos.splice(index, 1);
        }
      }
      
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    });
  
    // Botón de volver
    document.querySelector(".btn-volver").addEventListener("click", () => {
      window.history.back();
    });
  
    // Botón de añadir al carrito
    document.querySelector(".btn-carrito").addEventListener("click", () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      
      const itemCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: precioUnitario,
        cantidad: contador,
        imagen: producto.imagen,
        talla: document.querySelector(".tallas .activo").textContent,
        color: document.querySelector(".colores .activo").style.backgroundColor
      };
  
      // Verificar si ya está en el carrito
      const itemExistente = carrito.find(item => item.id === producto.id && 
        item.talla === itemCarrito.talla && 
        item.color === itemCarrito.color);
  
      if (itemExistente) {
        itemExistente.cantidad += contador;
      } else {
        carrito.push(itemCarrito);
      }
      
      localStorage.setItem("carrito", JSON.stringify(carrito));
      
      // Mostrar feedback
      const btn = document.querySelector(".btn-carrito");
      btn.textContent = "✅ Añadido al carrito";
      btn.style.backgroundColor = "var(--success)";
      
      setTimeout(() => {
        btn.innerHTML = `🛒 Añadir al Carrito | <span class="precio-producto">$${(precioUnitario * contador).toFixed(2)}</span>`;
        btn.style.backgroundColor = "var(--primary)";
      }, 2000);
    });
  });