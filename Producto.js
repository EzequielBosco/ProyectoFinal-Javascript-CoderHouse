class Producto {
    constructor(id, categoria, nombre, imagen, precio, stock) {
      this.id = id
      this.categoria = categoria
      this.nombre = nombre
      this.imagen = imagen
      this.precio = precio
      this.stock = stock
    }
    precioConIva() {
        const iva = 0.105;
        return this.precio + (this.precio * iva);
    }
}