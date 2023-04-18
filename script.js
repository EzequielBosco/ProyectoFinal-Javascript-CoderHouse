function primerLetraMayuscula(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

function filtrar(propiedad, valor) {
    const filtrado = productos.filter(producto => producto[propiedad] === valor);
    return filtrado
}

function listarProductos(productoComprar, cantidadUnidades) {
    return productoComprar.map(producto => {
        return `ID: ${producto.id}, Nombre: ${producto.nombre}, Unidades: ${cantidadUnidades}, Precio: ${producto.precioConIva() * cantidadUnidades} pesos.\n`
    }).join("\n")
}

function alerta(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    })
}

let informatica = [
    {   id: 1,
        categoria : "celulares",
        nombre : "galaxys23",
        imagen : {
            frente : "img/s23uf.png",
            derecha : "img/s23ud.png",
            izquierda : "img/s23ud.png",
            atras : "img/s23ua.png",
        },
        precio : 339999,
        stock : 15
    },
    {   id: 2,
        categoria : "celulares",
        nombre : "galaxys23+",
        imagen : {
            frente : "img/s23uf.png",
            derecha : "img/s23ud.png",
            izquierda : "img/s23ud.png",
            atras : "img/s23ua.png",
        },
        precio : 379999,
        stock : 10
    },
    {   id: 3,
        categoria : "celulares",
        nombre : "galaxys23ultra",
        imagen : {
            frente : "img/s23uf.png",
            derecha : "img/s23ud.png",
            izquierda : "img/s23ud.png",
            atras : "img/s23ua.png",
        },
        precio : 499999,
        stock : 5
    },
    {   id: 4,
        categoria : "tablets",
        nombre : "galaxytabs8",
        imagen : {
            frente : "img/s8ultraf.png",
            derecha : "img/s8ultrad.png",
            izquierda : "img/s8ultrai.png",
            atras : "img/s8ultraa.png",
        },
        precio : 313999,
        stock : 5
    },
    {   id: 5,
        categoria : "tablets",
        nombre : "galaxytabs8+",
        imagen : {
            frente : "img/s8ultraf.png",
            derecha : "img/s8ultrad.png",
            izquierda : "img/s8ultrai.png",
            atras : "img/s8ultraa.png",
        },
        precio : 390999,
        stock : 10
    },
    {   id: 6,
        categoria : "tablets",
        nombre : "galaxytabs8ultra",
        imagen : {
            frente : "img/s8ultraf.png",
            derecha : "img/s8ultrad.png",
            izquierda : "img/s8ultrai.png",
            atras : "img/s8ultraa.png",
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
      alerta("","¡Bienvenido!\nSu nombre de usuario ahora es: ", usuario);
      break;
    } else {
      alerta("", "El nombre de usuario debe contener caracteres de texto", "Intente nuevamente");
    }
} while (usuario != isNaN)

let carritoDOM = document.getElementById("carrito")

function finalizarCompra() {
    alerta("", `${usuario}, muchas gracias por su compra`)
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || []
renderizarCarrito(carrito)

mostrarProductos(informatica)
function mostrarProductos(arrayProductos) {
    let contenedor = document.getElementById("contenedorProductos")
    contenedor.innerHTML = ""

    arrayProductos.forEach(producto => {
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.className = "tarjetaProducto"
        
        tarjetaProducto.innerHTML = `
            <h3 class=titulo-producto>${primerLetraMayuscula(producto.nombre)}</h3>
            <p class=categoria-producto>${primerLetraMayuscula(producto.categoria)}</p>
            <img width="200px" height="180px" src="${producto.imagen.frente}"></img>
            <h3 class=categoria-precio>Precio: ${producto.precio}</h3>
            <p>Quedan <span id=span${producto.id}>${producto.stock}</span> unidades</p>
            <button class=boton-agregar id=${producto.id}>AGREGAR AL CARRITO</button>
        `
        contenedor.appendChild(tarjetaProducto)
        
        let boton = document.getElementById(producto.id)
        boton.addEventListener("click", agregarProductoAlCarrito)
    })
}

let botonPrecio = document.getElementById("btn-precio")
botonPrecio.addEventListener("click", filtrarPorPrecio)

function filtrarPorPrecio() {
    let filtrar = document.getElementById("filtro-precio");
    let opcion = filtrar.value;
    let productosOrdenados = informatica.sort((a, b) => {
      if (opcion === "mayor") {
        return b.precio - a.precio;
      } else {
        return a.precio - b.precio;
      }
    });
    mostrarProductos(productosOrdenados);
}

function agregarProductoAlCarrito(e) {
    let posicionProd = informatica.findIndex(producto => producto.id == e.target.id)
    let productoBuscado = informatica.find(producto => producto.id === Number(e.target.id))
    if (informatica[posicionProd].stock > 0) {
        alerta("", "Producto agregado al carrito")
        
        let elementoSpan = document.getElementById("span" + e.target.id)
        informatica[posicionProd].stock--
        elementoSpan.innerHTML = informatica[posicionProd].stock

        if (carrito.some(({ id }) => id == productoBuscado.id)) {
            let pos = carrito.findIndex(producto => producto.id == productoBuscado.id)
            carrito[pos].unidades++
            carrito[pos].subtotal = carrito[pos].precio * carrito[pos].unidades
            } else {
            carrito.push({
                id: productoBuscado.id,
                nombre: productoBuscado.nombre,
                precio: productoBuscado.precio,
                unidades: 1,
                subtotal: productoBuscado.precio,
            })
            }
            localStorage.setItem("carrito", JSON.stringify(carrito))
            renderizarCarrito(carrito)
    } else {
    alerta("error", "No hay stock", `No se puedo agregar el producto ${productoBuscado.nombre} al carrito`)
    }
}

function renderizarCarrito(arrayDeProductos) {
    carritoDOM.innerHTML = `<h3>En carrito: </h3>`
    arrayDeProductos.forEach(({ nombre, precio, unidades, subtotal }) => {
      carritoDOM.innerHTML += `<h4>Producto: ${nombre}, Precio: ${precio}, Unidades: ${unidades}, Subtotal: ${subtotal}</h4>`
    })
    carritoDOM.innerHTML += `<button id=comprar>Finalizar compra</button>`

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarCompra)
}

let buscador = document.getElementById("buscador")
buscador.addEventListener("input", filtrar)

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarCarrito)

function filtrar(e) {
  let arrayFiltrado = informatica.filter(producto => producto.nombre.includes(buscador.value))
  mostrarProductos(arrayFiltrado)
}

function mostrarCarrito() {
    let contenedorProductos = document.getElementById("contenedorProductos")
    carritoDOM.classList.toggle("ocultar")
    contenedorProductos.classList.toggle("ocultar")
}

// let menu;
// let categorias;
// let cantidadUnidades;
// do {
//     menu = parseInt(prompt(`Ingrese la operación a realizar:\n1 - Buscar productos\n2 - Agregar al carrito\n3 - Mostrar carrito\n0 - Salir`))

//     switch (menu) {
//         case 0:
//             break;
//         case 1: 
//             categorias = prompt("Ingrese una categoria: (celulares o tablets)").toLowerCase();
//             let productosFiltrados = filtrar('categoria', categorias);
//             let nombresProductos = productosFiltrados.map(producto => producto.nombre);
//             if (informatica.some(producto => producto.categoria == categorias)) {
//                 alert(`Productos encontrados en categoria ${categorias}: \n` + nombresProductos.join('\n'));
//             } else {
//                 alert("La categoria no fue encontrada");
//             }
//             break;
//         case 2:
//             let opcion;
//             do {
//                 opcion = parseInt(prompt(`Productos disponibles:\n${listaProductos}\nIngrese el número del producto que desea comprar (0 para salir):`))
//                 let productoComprar = productos.find(producto => producto.id === opcion);
//                 if (productoComprar) {
//                     cantidadUnidades = parseInt(prompt(`Producto seleccionado: ${productoComprar.nombre}\n- Stock disponible: ${productoComprar.stock}\nIngrese la cantidad que desea comprar:`));
                    
//                     if (cantidadUnidades <= productoComprar.stock && cantidadUnidades > 0) {
//                         alerta("success", "Producto agregado al carrito")
//                         carrito.push({producto: productoComprar, cantidad: cantidadUnidades})
//                         productoComprar.stock -= cantidadUnidades;
//                         alert(`${usuario}\nSe agregó ${productoComprar.nombre} (${cantidadUnidades} unidades) al carrito por un total de ${productoComprar.precioConIva() * cantidadUnidades} pesos.`)
//                     } else if (cantidadUnidades < 1) {
//                         alert("Ingrese un número de stock válido")
//                     } else {
//                         alert("No hay stock suficiente para realizar la compra")
//                     }
//                 } 
//             } while (opcion != 0)
//             break;
//         case 3: 
//             if (carrito.length <= 0) {
//                 alert("No hay productos en su carrito.")
//             } else {
//                 let total = 0;
//                 let mensaje = `${usuario}\nSus productos en carrito son:\n`
//                     carrito.forEach(item => {
//                         let producto = item.producto;
//                         let cantidad = item.cantidad;
//                         total += producto.precioConIva() * cantidad;
//                         mensaje +=  listarProductos([producto], cantidad);
//                 });
//                 mensaje += `Total: ${total} pesos (incluido el IVA).`
//                 alert(mensaje);
//             }
//             break;
//         default:
//             alert("Elija una opción")
//     }
// } while (menu != 0)

// tostadita("hola")

// function tostadita(text) {
//     Toastify({
//         text: text,
//         duration: 2000,
//         gravity: 'top',
//         position: 'right',
//     }).showToast();    
// }
// filtrar por precio, ordenar por popularidad, ordenar alfabeticamente, eliminar del carrito