let carritoDOM = document.getElementById("carrito")
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
renderizarCarrito(carrito)

let botonCarrito = document.getElementById("botonCarrito")
botonCarrito.addEventListener("click", mostrarCarrito)

fetch("productos.json")
    .then(respuesta => respuesta.json())
    .then(productos => {
        mostrarProductos(productos)

        //filtros 
        let buscador = document.getElementById("buscador")
        buscador.addEventListener("input", () => {
            productosFiltrados = filtrarPorBusqueda(productos);
            aplicarFiltros();
        })

        let filtroCategorias = document.getElementById("filtro-categoria");
        filtroCategorias.addEventListener("change", () => {
            productosFiltrados = filtrarPorCategorias(productos);
            aplicarFiltros();
        });

        let filtroPrecio = document.getElementById("filtro-precio");
        filtroPrecio.addEventListener("change", () => {
            productosFiltrados = filtrarPorPrecio(productos);
            aplicarFiltros();
        });

        function filtrarPorBusqueda(productos) {
            let busqueda = buscador.value.toLowerCase();
            return productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda));
        }

        function filtrarPorCategorias(productos) {
            let opcion = filtroCategorias.value;
            if (opcion === "celulares") {
                return productos.filter(producto => producto.categoria === "celulares");
            } else if (opcion === "tablets") {
                return productos.filter(producto => producto.categoria === "tablets");
            } else {
                return productos;
            }
        }

        function filtrarPorPrecio(productos) {
            let opcion = filtroPrecio.value;
            return productos.slice().sort((a, b) => {
                if (opcion === "mayor") {
                    return b.precio - a.precio;
                } else {
                    return a.precio - b.precio;
                }
            });
        }

        function aplicarFiltros() {
            let productosFiltradosFinal = productosFiltrados;
            productosFiltradosFinal = filtrarPorBusqueda(productosFiltradosFinal);
            productosFiltradosFinal = filtrarPorCategorias(productosFiltradosFinal);
            productosFiltradosFinal = filtrarPorPrecio(productosFiltradosFinal);
            mostrarProductos(productosFiltradosFinal);
        }
        
})


let sesionIniciada = JSON.parse(sessionStorage.getItem("sesionIniciada")) || false;
// REGISTRO

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
    sessionStorage.setItem("sesionIniciada", JSON.stringify(sesionIniciada));
    sessionStorage.setItem('nombreUsuario', infoUsuario.usuario);
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

// CERRAR SESION
const $btnCerrarSesion = document.querySelector("#cerrarSesion")
$btnCerrarSesion.addEventListener("click", () => {
    if (sessionStorage.getItem("sesionIniciada")) {
    alertaAlta("Sesión cerrada")
    sesionIniciada = false
    sessionStorage.setItem("sesionIniciada", JSON.stringify(sesionIniciada))
    sessionStorage.removeItem(`nombreUsuario`)
    } else {
        alerta("error", "No estás en una sesión")
    }
})

// PRODUCTOS
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
    })
}

function cambiarImagen(img, imagenAtras) {
    img.src = imagenAtras;
}
  
function restaurarImagen(img) {
    img.src = img.getAttribute("data-original-src");
}

// CARRITO
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
    $("div").click(function() {
        $(e.target.closest(".tarjetaProducto")).hide("slow");
    });
    }
}

function renderizarCarrito(arrayDeProductos) {
    if (carrito.length > 0) {
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
    } else {
        carritoDOM.innerHTML = `<a><i class="fa-solid fa-xmark d-flex justify-content-end" id=cerrarCarrito></i></a>`
        carritoDOM.innerHTML += `<h4 class=text-center>Carrito vacío</h4>`
        carritoDOM.innerHTML += `<i class="fa-solid fa-cart-shopping d-flex justify-content-center"></i>`

        let btnCerrarCarrito = document.getElementById("cerrarCarrito")
        btnCerrarCarrito.addEventListener("click", cerrarCarrito)

        function cerrarCarrito() {
            carritoDOM.classList.toggle("ocultar")
        }
    }
}

function mostrarCarrito() {
    carritoDOM.classList.toggle("ocultar")
}

function finalizarCompra() {
    sesionIniciada = JSON.parse(sessionStorage.getItem("sesionIniciada")) || false;
    let nombreUsuario = sessionStorage.getItem('nombreUsuario');
    if (sesionIniciada) {
    alerta("", `¡Muchas gracias por su compra!`, `${primerLetraMayuscula(nombreUsuario)}, te enviamos un correo con la factura`)
    localStorage.removeItem("carrito")
    carrito = []
    renderizarCarrito(carrito)
    carritoDOM.classList.toggle("ocultar")
    } else {
        alerta("error", "Por favor inicie sesion")
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

//---------------------------------------------------------

// FILTROS
// let buscador = document.getElementById("buscador")
// buscador.addEventListener("input", filtrarPorNombre)

// let inputs = document.getElementsByClassName("input")

// for (const input of inputs) {
//   input.addEventListener("click", filtrarPorCategoria)
// }
// console.log(inputs)

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