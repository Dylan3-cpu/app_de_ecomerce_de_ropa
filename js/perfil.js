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
  const nombreInput = document.getElementById("input-nombre")
  const correoInput = document.getElementById("input-correo")
  const telefonoInput = document.getElementById("input-telefono")
  const direccionInput = document.getElementById("input-direccion")
  const ciudadInput = document.getElementById("input-ciudad")
  const imagenInput = document.getElementById("input-imagen")
  const imagenPerfil = document.getElementById("imagen-perfil")
  const btnGuardar = document.getElementById("guardar-perfil")

  // Verificar la imagen de perfil
  verificarImagen(imagenPerfil)

  const perfil = JSON.parse(localStorage.getItem("perfil")) || {}

  if (perfil.nombre) nombreInput.value = perfil.nombre
  if (perfil.correo) correoInput.value = perfil.correo
  if (perfil.telefono) telefonoInput.value = perfil.telefono
  if (perfil.direccion) direccionInput.value = perfil.direccion
  if (perfil.ciudad) ciudadInput.value = perfil.ciudad
  if (perfil.imagen) {
    imagenPerfil.src = perfil.imagen
    verificarImagen(imagenPerfil)
  }

  imagenInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        imagenPerfil.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  })

  btnGuardar.addEventListener("click", () => {
    if (!nombreInput.value) {
      alert("Por favor ingresa tu nombre")
      return
    }

    if (!direccionInput.value) {
      alert("Por favor ingresa tu dirección")
      return
    }

    const nuevoPerfil = {
      nombre: nombreInput.value,
      correo: correoInput.value,
      telefono: telefonoInput.value,
      direccion: direccionInput.value,
      ciudad: ciudadInput.value,
      imagen: imagenPerfil.src,
    }

    localStorage.setItem("perfil", JSON.stringify(nuevoPerfil))
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nombre: nombreInput.value,
        imagen: imagenPerfil.src,
      }),
    )

    alert("Perfil guardado correctamente")
    window.location.href = "../index.html"
  })
})
