let carritoDOM = document.getElementById("carrito")
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
renderizarCarrito(carrito)

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarCarrito)

fetch("productos.json")
    .then(respuesta => respuesta.json())
    .then(productos => {
        mostrarProductos(productos)
        let buscador = document.getElementById("buscador")
        buscador.addEventListener("input", () => {
            filtrar(productos)
        })
})

// REGISTRO
let sesionIniciada = JSON.parse(localStorage.getItem("sesionIniciada")) || false;

let usuario = document.getElementById("usuario")
let email = document.getElementById("email")
let contrasenia = document.getElementById("password")
let registrarse = document.getElementById("registrarse")

let infoUsuario;
registrarse.addEventListener("click", () => {
    if (usuario.value && email.value && contrasenia.value) {
        let infoUsuario = { usuario: usuario.value, email: email.value, contrasenia: contrasenia.value}
        alerta("success", "Creaste tu usuario", `${infoUsuario.usuario}`)
        localStorage.setItem(`infoUsuario_${usuario.value}`, JSON.stringify(infoUsuario))
        mostrarSignin()
    } else {
        alerta("error", "Por favor, completa todos los campos para registrarte")
    }
})

// INICIAR SESION
let usuarioIS = document.getElementById("usuarioIS")
let passwordIS = document.getElementById("passwordIS")
let iniciarSesion = document.getElementById("iniciarSesion")


iniciarSesion.addEventListener("click", () => {
  infoUsuario = JSON.parse(localStorage.getItem(`infoUsuario_${usuarioIS.value}`))
  if (infoUsuario && infoUsuario.usuario == usuarioIS.value && infoUsuario.contrasenia == passwordIS.value) {
    alerta("success", "Iniciaste sesión como", `${infoUsuario.usuario}`) 
    sesionIniciada = true  
    localStorage.setItem("sesionIniciada", JSON.stringify(sesionIniciada));
    sesionIniciada = true
  } else {
    alerta("error", "Datos incorrectos", "Intente nuevamente")
  }

})

// CAMBIAR REGISTRO - INICIO SESION
const $btnRegistro = document.querySelector("#vuelveRegistro");
const $btnInicioSesion = document.querySelector("#vuelveSesion");
const $formRegistro = document.querySelector("#signup");
const $formInicioSesion = document.querySelector("#signin");

$btnRegistro.addEventListener("click", () => {
  $formRegistro.classList.remove("ocultar");
  $formInicioSesion.classList.add("ocultar");
});

$btnInicioSesion.addEventListener("click", mostrarSignin)

function mostrarSignin() {
  $formInicioSesion.classList.remove("ocultar");
  $formRegistro.classList.add("ocultar");
};

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
            <h4 class=categoria-precio>Precio: ${producto.precio}</h4>
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
    alerta("error", "No hay stock", `No se puedo agregar el producto ${primerLetraMayuscula(productoBuscado.nombre)} al carrito`)
    }
}

function renderizarCarrito(arrayDeProductos) {
    carritoDOM.innerHTML = `<a><i class="fa-solid fa-xmark d-flex justify-content-end" id=cerrarCarrito></i></a>`
    carritoDOM.innerHTML += `<h4 class="linea">Mi compra: </h4>`
    carritoDOM.style.height = "100%"
    let precioTotal = 0;
    arrayDeProductos.forEach(({ nombre, precio, unidades, subtotal}) => {
        carritoDOM.innerHTML += `<h5>-Producto:</h5><p> ${primerLetraMayuscula(nombre)}, Precio: ${precio}, Unidades: ${unidades}, Subtotal: ${subtotal}$</p>`
        precioTotal += subtotal
    }) 
    carritoDOM.innerHTML += `<h4>Precio total con IVA: ${precioConIva(precioTotal)}$</h4>`
    carritoDOM.innerHTML += `<button id=comprar>Finalizar compra</button>`

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarCompra)

    let btnCerrarCarrito = document.getElementById("cerrarCarrito")
    btnCerrarCarrito.addEventListener("click", cerrarCarrito)

    function cerrarCarrito() {
        carritoDOM.classList.toggle("ocultar")
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
    if (carrito.length < 1) {
        alertaAlta("El carrito esta vacio")
        carritoDOM.classList.toggle("ocultar")
    }
    carritoDOM.classList.toggle("ocultar")
}

function finalizarCompra() {
    sesionIniciada = JSON.parse(localStorage.getItem("sesionIniciada")) || false;
    if (sesionIniciada) {
    alerta("", `¡Muchas gracias por su compra!`, `Te enviamos un correo con la factura`)
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
    carritoDOM.classList.toggle("ocultar")
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
        gravity: 'bottom',
        position: 'right',
    }).showToast();    
}

function alertaAlta(text) {
    Toastify({
        text: text,
        duration: 1000,
        gravity: 'top',
        position: 'center',
    }).showToast();    
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