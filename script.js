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
            frente : "img/s23f.png",
            derecha : "img/s23d.png",
            izquierda : "img/s23d.png",
            atras : "img/s23a.png",
        },
        precio : 339999,
        stock : 15
    },
    {   id: 2,
        categoria : "celulares",
        nombre : "galaxys23+",
        imagen : {
            frente : "img/s23f.png",
            derecha : "img/s23d.png",
            izquierda : "img/s23d.png",
            atras : "img/s23a.png",
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
            frente : "img/s8f.png",
            derecha : "img/s8d.png",
            izquierda : "img/s8i.png",
            atras : "img/s8a.png",
        },
        precio : 313999,
        stock : 5
    },
    {   id: 5,
        categoria : "tablets",
        nombre : "galaxytabs8+",
        imagen : {
            frente : "img/s8+f.png",
            derecha : "img/s8+d.png",
            izquierda : "img/s8+i.png",
            atras : "img/s8+a.png",
        },
        precio : 390999,
        stock : 10
    },
    {   id: 6,
        categoria : "tablets",
        nombre : "galaxytabs8ultra",
        imagen : {
            frente : "img/s8uf.png",
            derecha : "img/s8ud.png",
            izquierda : "img/s8ui.png",
            atras : "img/s8ua.png",
        },
        precio : 569999,
        stock : 5
    },
    {   id: 7,
        categoria : "celulares",
        nombre : "galaxyzfold4",
        imagen : {
            frente : "img/zfold4f.png",
            derecha : "img/zfold4d.png",
            izquierda : "img/zfold4i.png",
            atras : "img/zfold4a.png",
        },
        precio : 569999,
        stock : 5
    },
    {   id: 8,
        categoria : "celulares",
        nombre : "galaxyzflip4",
        imagen : {
            frente : "img/zflip4f.png",
            derecha : "img/zflip4d.png",
            izquierda : "img/zflip4i.png",
            atras : "img/zflip4a.png",
        },
        precio : 299999,
        stock : 10
    },
    {   id: 9,
        categoria : "celulares",
        nombre : "galaxyzfold3",
        imagen : {
            frente : "img/zfold3f.png",
            derecha : "img/zfold3d.png",
            izquierda : "img/zfold3i.png",
            atras : "img/zfold3a.png",
        },
        precio : 379999,
        stock : 10
    },
    {   id: 10,
        categoria : "celulares",
        nombre : "galaxyzflip3",
        imagen : {
            frente : "img/zflip3f.png",
            derecha : "img/zflip3d.png",
            izquierda : "img/zflip3i.png",
            atras : "img/zflip3a.png",
        },
        precio : 229999,
        stock : 15
    }
]

let iniciarSesion = document.getElementById("iniciar-sesion")
iniciarSesion.addEventListener("click", crearUsuario)

let usuario;
function crearUsuario() {
  Swal.fire({
    title: "Ingrese su nombre",
    input: "text",
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value) {
        return "Por favor ingresa un nombre válido";
      }
    }
  }).then((resultado) => {
    if (resultado.isConfirmed) {
        usuario = primerLetraMayuscula(resultado.value);
        Swal.fire("Tu nombre de usuario es:", `${usuario}`);
    }
  });
}

let carritoDOM = document.getElementById("carrito")

function finalizarCompra() {
    if (usuario) {
    alerta("", `${usuario}, muchas gracias por su compra`)
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
    } else {
        alerta("error", "Por favor inicie sesion")
    }
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
            <section class=imagenes>
                <img src="${producto.imagen.frente}"></img>
                <img src="${producto.imagen.derecha}"></img>
                <img src="${producto.imagen.izquierda}"></img>
                <img src="${producto.imagen.atras}"></img>
            </section>
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

let botonCategorias = document.getElementById("btn-categoria")
botonCategorias.addEventListener("click", filtrarPorCategorias)

function filtrarPorCategorias() {
    let filtrados = document.getElementById("filtro-categoria")
    let opcion = filtrados.value
    if (opcion === "celulares") {
        productosPorCategoria = informatica.filter(producto => producto.categoria === "celulares");
    } else if (opcion === "tablets") {
        productosPorCategoria = informatica.filter(producto => producto.categoria === "tablets");
    } else {
        productosPorCategoria = informatica;
    }
    
    mostrarProductos(productosPorCategoria);
}

function agregarProductoAlCarrito(e) {
    let posicionProd = informatica.findIndex(producto => producto.id == e.target.id)
    let productoBuscado = informatica.find(producto => producto.id === Number(e.target.id))
    if (informatica[posicionProd].stock > 0) {
        alertaBaja("Producto agregado al carrito")
        
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
    if (carrito.length > 0) {
    carritoDOM.innerHTML = `<h3>En carrito: </h3>`
    arrayDeProductos.forEach(({ nombre, precio, unidades, subtotal }) => {
      carritoDOM.innerHTML += `<h4>Producto: ${nombre}, Precio: ${precio}, Unidades: ${unidades}, Subtotal: ${subtotal}</h4>`
    })
    carritoDOM.innerHTML += `<button id=comprar>Finalizar compra</button>`
    

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarCompra)
    } else {
        carritoDOM.innerHTML = `<p>VACIO</p>`
    }
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

function alertaBaja(text) {
    Toastify({
        text: text,
        duration: 2000,
        gravity: 'top',
        position: 'right',
    }).showToast();    
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


// filtrar por precio, ordenar por popularidad, ordenar alfabeticamente, eliminar del carrito