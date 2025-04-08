class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId)
    this.init()
  }

  init() {
    const closeBtn = this.modal.querySelector(".modal-cerrar")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close())
    }

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close()
      }
    })
  }

  open() {
    this.modal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  close() {
    this.modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  setContent(html) {
    const content = this.modal.querySelector(".modal-contenido")
    if (content) {
      content.innerHTML = html
      this.init()
    }
  }
}

export default Modal
