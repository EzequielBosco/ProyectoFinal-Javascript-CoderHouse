do {
    var usuario = prompt("Ingrese su nombre: ")
  
    if (isNaN(usuario)) {
      alert("Su nombre de usuario ahora es: " + usuario);
      break;
    } else {
      alert("El nombre de usuario debe contener caracteres de texto, intente nuevamente");
    }
  } while (usuario != isNaN(usuario))
    
let moviles = [
    {   id: 1,
        categoria : "celulares",
        nombre : "galaxys23",
        imagen : "s23f.avif",
        precio : 339.999,
        stock : 15
    },
    {   id: 2,
        categoria : "celulares",
        nombre : "galaxys23+",
        imagen : "s23f.avif",
        precio : 379.999,
        stock : 10
    },
    {   id: 3,
        categoria : "celulares",
        nombre : "galaxys23ultra",
        imagen : "s23f.avif",
        precio : 499.999,
        stock : 5
    }
]

let productos = moviles.map(producto => {
    return new Producto(producto.id, producto.categoria, producto.nombre, producto.imagen, producto.precio, producto.stock)
}) 

let carrito = []
let listaProductos = productos.map(producto => producto.id + " " + producto.nombre).join("\n")
console.log(listaProductos)

let opcion;
do {
    opcion = parseInt(prompt(`Productos disponibles:\n${listaProductos}\nIngrese el número del producto que desea comprar (0 para salir):`))
    let productoComprar = productos.find(producto => producto.id === opcion)
    if (productoComprar) {
        let cantidadUnidades = parseInt(prompt(`Producto seleccionado: ${productoComprar.nombre}\n- Stock disponible: ${productoComprar.stock}\nIngrese la cantidad que desea comprar:`));
        
        if (cantidadUnidades <= productoComprar.stock) {
            carrito.push(productoComprar, cantidadUnidades)
            productoComprar.stock -= cantidadUnidades;
            alert(`Se agregó ${productoComprar.nombre}, ${cantidadUnidades} unidades al carrito`)
        } else {
            alert("No hay stock suficiente para realizar la compra")
        }
    } 
} while (opcion != 0)

// menu = Number(prompt(`${usuario} ingrese la operación a realizar:\n1 -`))
// let categoria = prompt("Ingrese una categoria:").toLowerCase()
// alert(productos.filter(producto => producto.categoria === catergoria))
// filtrar por precio, ordenar por popularidad, ordenar alfabeticamente, eliminar del carrito