let carritoDOM = document.getElementById("carrito")
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
renderizarCarrito(carrito)

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarCarrito)

fetch("productos.json")
    .then(respuesta => respuesta.json())
    .then(productos => {
        mostrarProductos(productos)
        // let buscar = document.getElementById("buscar")
        // buscar.addEventListener("click", () => filtrar(productos))
        let buscador = document.getElementById("buscador")
        buscador.addEventListener("input", () => {
            filtrar(productos)
        })
})

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
                <img onmouseover="cambiarImagen(this, '${producto.imagen.atras}')" onmouseout="restaurarImagen(this)" src="${producto.imagen.frente}" data-original-src="${producto.imagen.frente}" data-atras-src="${producto.imagen.atras}"></img>
            </section>
            <h3 class=categoria-precio>Precio: ${producto.precio}</h3>
            <p>Quedan <span id=span${producto.id}>${producto.stock}</span> unidades</p>
            <button class=boton-agregar id=${producto.id}>AGREGAR AL CARRITO</button>
        `
        contenedor.appendChild(tarjetaProducto)
        
        let boton = document.getElementById(producto.id)
        boton.addEventListener("click", (e) => {
            agregarProductoAlCarrito(e, arrayProductos)
    })
})}

function cambiarImagen(img, imagenAtras) {
    img.src = imagenAtras;
}
  
function restaurarImagen(img) {
    img.src = img.getAttribute("data-original-src");
}

function agregarProductoAlCarrito(e, informatica) {
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
    carritoDOM.innerHTML = `<h4>En carrito: </h4>`
    let precioTotal = 0;
    arrayDeProductos.forEach(({ nombre, precio, unidades, subtotal}) => {
        carritoDOM.innerHTML += `<h5>-Producto:</h5><p> ${nombre}, Precio: ${precio}, Unidades: ${unidades}, Subtotal: ${subtotal}</p>`
        precioTotal += subtotal
    }) 
    carritoDOM.innerHTML += `<h4>Precio total con IVA: ${precioConIva(precioTotal)}</h4>`
    carritoDOM.innerHTML += `<button id=comprar>Finalizar compra</button>`
    

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarCompra)
    } else {
        carritoDOM.innerHTML = `<p>VACIO</p>`
    }
}

function precioConIva(precio) {
    const iva = 0.105;
    return precio + (precio * iva);
}

function filtrar(informatica) {
    let arrayFiltrado = informatica.filter(producto => producto.nombre.includes(buscador.value.toLowerCase()))
    mostrarProductos(arrayFiltrado)
}
  
function mostrarCarrito() {
      let contenedorProductos = document.getElementById("contenedorProductos")
      carritoDOM.classList.toggle("ocultar")
      contenedorProductos.classList.toggle("ocultar")
}

function finalizarCompra() {
    if (usuario) {
    alerta("", `¡Muchas gracias por su compra!`, `${primerLetraMayuscula(usuario)}, te enviamos un correo con la factura`)
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
    } else {
        alerta("error", "Por favor inicie sesion")
    }
}

// let inputs = document.getElementsByClassName("input")
// console.log(inputs)
// for (const input of inputs) {
//   input.addEventListener("click", filtrarPorCategoria)
// }

// function filtrarPorCategoria(e) {
//     console.log(e.target.id)
//     console.log(e.target.checked)
//     let filtros = []
//     for (const input of inputs) {
//       console.log(input.checked)
//       console.log(input.id)
//       if (input.checked) {
//         filtros.push(input.id)
//       }
//     }
//     console.log(filtros)
//     let arrayFiltrado = productos.filter(producto => filtros.includes(producto.categoria))
//     /* if (arrayFiltrado.length > 0) {
//       renderizarTarjetas(arrayFiltrado)
//     } else {
//       renderizarTarjetas(productos)
//     } */
//     renderizarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : productos)
// }
  
//   function filtrarPorNombre() {
//     let arrayFiltrado = productos.filter(producto => producto.nombre.includes(buscador.value))
//     renderizarTarjetas(arrayFiltrado)
// }

function primerLetraMayuscula(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

function alerta(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    })
}

function alertaBaja(text) {
    Toastify({
        text: text,
        duration: 2000,
        gravity: 'top',
        position: 'right',
    }).showToast();    
}

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
        usuario = resultado.value.toLowerCase();
        Swal.fire("Tu nombre de usuario es:", `${usuario}`);
    }
  });
}

const iniciarSesion = document.getElementById("iniciar-sesion")
iniciarSesion.addEventListener("click", crearUsuario)

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


// FILTROS
// let buscador = document.getElementById("buscador")
// buscador.addEventListener("input", filtrarPorNombre)

// let inputs = document.getElementsByClassName("input")
// console.log(inputs)
// for (const input of inputs) {
//   input.addEventListener("click", filtrarPorCategoria)
// }

// function filtrarPorCategoria(e) {
//   let filtros = []
//   for (const input of inputs) {
//     console.log(input.checked)
//     console.log(input.id)
//     if (input.checked) {
//       filtros.push(input.id)
//     }
//   }
//   let arrayFiltrado = productos.filter(producto => filtros.includes(producto.categoria))
//   /* if (arrayFiltrado.length > 0) {
//     renderizarTarjetas(arrayFiltrado)
//   } else {
//     renderizarTarjetas(productos)
//   } */
//   renderizarTarjetas(arrayFiltrado.length > 0 ? arrayFiltrado : productos)
// }



// REGISTRO
// let login = document.getElementById("login")
// let pantallaCompra = document.getElementById("pantallaCompra")

// // REGISTRARSE
// let usuario = document.getElementById("usuario")
// let contrasenia = document.getElementById("contrasenia")
// let registrarse = document.getElementById("registrarse")

// registrarse.addEventListener("click", () => {
//   console.log(usuario.value)
//   console.log(contrasenia.value)
//   let infoUsuario = { usuario: usuario.value, contrasenia: contrasenia.value}
//   localStorage.setItem("infoUsuario", JSON.stringify(infoUsuario))
// })

// // INICIAR SESION
// let usuarioIS = document.getElementById("usuarioIS")
// let contraseniaIS = document.getElementById("contraseniaIS")
// let iniciarSesion = document.getElementById("iniciarSesion")

// iniciarSesion.addEventListener("click", () => {
//   let infoUsuario = JSON.parse(localStorage.getItem("infoUsuario"))
//   if (infoUsuario.usuario == usuarioIS.value && infoUsuario.contrasenia == contraseniaIS.value) {
//     alert("Bienvenido")   
//     login.classList.add("ocultar")
//     pantallaCompra.classList.remove("ocultar")
//   } else {
//     alert("Datos incorrectos, reintente")
//   }
// })



// PRODUCTOS
// `
//     <h3 class=titulo-producto>${primerLetraMayuscula(producto.nombre)}</h3>
//     <p class=categoria-producto>${primerLetraMayuscula(producto.categoria)}</p>
//     <section class=imagenes>
//         <img src="${producto.imagen.frente}"></img>
//         <img src="${producto.imagen.derecha}"></img>
//         <img src="${producto.imagen.izquierda}"></img>
//         <img src="${producto.imagen.atras}"></img>
//     </section>
//     <h3 class=categoria-precio>Precio: ${producto.precio}</h3>
//     <p>Quedan <span id=span${producto.id}>${producto.stock}</span> unidades</p>
//     <button class=boton-agregar id=${producto.id}>AGREGAR AL CARRITO</button>
// `