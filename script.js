function primerLetraMayuscula(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

function filtrar(propiedad, valor) {
    const filtrado = productos.filter(producto => producto[propiedad] === valor);
    return filtrado
}

let informatica = [
    {   id: 1,
        categoria : "celulares",
        nombre : "galaxys23",
        imagen : {
            frente : "s23uf.png",
            derecha : "s23ud.png",
            izquierda : "s23ud.png",
            atras : "s23ua.png",
        },
        precio : 339999,
        stock : 15
    },
    {   id: 2,
        categoria : "celulares",
        nombre : "galaxys23+",
        imagen : {
            frente : "s23uf.png",
            derecha : "s23ud.png",
            izquierda : "s23ud.png",
            atras : "s23ua.png",
        },
        precio : 379999,
        stock : 10
    },
    {   id: 3,
        categoria : "celulares",
        nombre : "galaxys23ultra",
        imagen : {
            frente : "s23uf.png",
            derecha : "s23ud.png",
            izquierda : "s23ud.png",
            atras : "s23ua.png",
        },
        precio : 499999,
        stock : 5
    },
    {   id: 4,
        categoria : "tablets",
        nombre : "galaxytabs8",
        imagen : {
            frente : "s8ultraf.png",
            derecha : "s8ultrad.png",
            izquierda : "s8ultrai.png",
            atras : "s8ultraa.png",
        },
        precio : 313999,
        stock : 5
    },
    {   id: 5,
        categoria : "tablets",
        nombre : "galaxytabs8+",
        imagen : {
            frente : "s8ultraf.png",
            derecha : "s8ultrad.png",
            izquierda : "s8ultrai.png",
            atras : "s8ultraa.png",
        },
        precio : 390999,
        stock : 10
    },
    {   id: 6,
        categoria : "tablets",
        nombre : "galaxytabs8ultra",
        imagen : {
            frente : "s8ultraf.png",
            derecha : "s8ultrad.png",
            izquierda : "s8ultrai.png",
            atras : "s8ultraa.png",
        },
        precio : 569999,
        stock : 5
    }
]

let usuario;
do {
    let palabra = prompt("Ingrese su nombre: ")
    usuario = primerLetraMayuscula(palabra)
    if (isNaN(usuario)) {
      alert("Su nombre de usuario ahora es: " + usuario);
      break;
    } else {
      alert("El nombre de usuario debe contener caracteres de texto, intente nuevamente");
    }
} while (usuario != isNaN)

let productos = informatica.map(producto => {
    return new Producto(producto.id, producto.categoria, producto.nombre, producto.imagen, producto.precio, producto.stock)
})

let carrito = []
let listaProductos = productos.map(producto => producto.id + " " + producto.categoria + ": " + producto.nombre).join("\n")

let menu;
let categorias;
do {
    menu = parseInt(prompt(`Ingrese la operación a realizar:\n1 - Buscar productos\n2 - Agregar al carrito\n0 - Salir`))

    switch (menu) {
        case 0:
            break;
        case 1: 
            categorias = prompt("Ingrese una categoria:").toLowerCase();
            let productosFiltrados = filtrar('categoria', categorias);
            let nombresProductos = productosFiltrados.map(producto => producto.nombre);
            if (informatica.some(producto => producto.categoria == categorias)) {
                alert(`Productos encontrados en categoria ${categorias}: \n` + nombresProductos.join('\n'));
            } else {
                alert("La categoria no fue encontrada")
            }
            break;
        case 2:
            let opcion;
            do {
                opcion = parseInt(prompt(`Productos disponibles:\n${listaProductos}\nIngrese el número del producto que desea comprar (0 para salir):`))
                let productoComprar = productos.find(producto => producto.id === opcion);
                if (productoComprar) {
                    let cantidadUnidades = parseInt(prompt(`Producto seleccionado: ${productoComprar.nombre}\n- Stock disponible: ${productoComprar.stock}\nIngrese la cantidad que desea comprar:`));
                    
                    if (cantidadUnidades <= productoComprar.stock && cantidadUnidades > 0) {
                        carrito.push(productoComprar, cantidadUnidades)
                        productoComprar.stock -= cantidadUnidades;
                        alert(`${usuario}, se agregó ${productoComprar.nombre} (${cantidadUnidades} unidades) al carrito por un total de ${productoComprar.precioConIva() * cantidadUnidades} pesos.`)
                    } else if (cantidadUnidades < 1) {
                        alert("Ingrese un número de stock válido")
                    } else {
                        alert("No hay stock suficiente para realizar la compra")
                    }
                } 
            } while (opcion != 0)
            break;
        default:
            alert("Elija una opción")
    }
} while (menu != 0)

// filtrar por precio, ordenar por popularidad, ordenar alfabeticamente, eliminar del carrito