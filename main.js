const apiKey = `cddd6530`;

let inputBusqueda = document.getElementById(`busqueda`);
let btnBuscar = document.getElementById(`btnBuscar`);

let listaPeliculas = document.getElementById(`peliculas`);
let listaFavoritos = document.getElementById(`favoritos`);

let btnVistaBuscador = document.getElementById(`buscador`);
let btnVistaFavoritos = document.getElementById(`btnFavoritos`);
let btnVistaTrailers = document.getElementById(`btnTrailers`);
let vistaBuscador = document.getElementById(`vistaBuscador`);
let vistaFavoritos = document.getElementById(`vistaFavoritos`);
let vistaTrailers = document.getElementById(`vistaTrailers`);

let btnEliminarLocal = document.getElementById(`eliminarLocal`)

let btnAgregarFavorito = document.getElementsByClassName(`btnFavorito`)

const eliminarFavorito = (id) => {
    local = JSON.parse(localStorage.favoritos)
    index = local.findIndex(item => item.imdbID === id)
    local.splice(index, 1)
    localStorage.favoritos = JSON.stringify(local)
}

const agregarFavorito = (id, titulo, img) => {
    if (!localStorage.favoritos) {
        localStorage.favoritos = JSON.stringify([])
    }
    if (localStorage.favoritos) {
        const esta = JSON.parse(localStorage.favoritos).find(({ imdbID }) => imdbID === id);
        if (!esta) {
            let pelicula = {
                imdbID: id,
                Title : titulo,
                Poster: img,
            }
            if (!localStorage.favoritos) {
                localStorage.favoritos = JSON.stringify([pelicula])
            } else {
                let local = JSON.parse(localStorage.getItem("favoritos"))
                local.push(pelicula)
                localStorage.favoritos = JSON.stringify(local)
            }
        }
    }
}

const notificacion = async () => {
    let noti = document.createElement(`div`)
    noti.className = `notificacion bg-success p-2 rounded-3`
    let p = document.createElement(`p`)
    p.className = `m-0 text-white bg-success`
    p.innerHTML = `Agregada con exito`
    noti.append(p)
    document.body.append(noti)
    await setTimeout(() => {
        document.body.removeChild(noti)
    }, 1500)
}

const traerPeliculas = async (busqueda) => {
    listaPeliculas.innerHTML = ``
    let div = document.createElement(`div`)
    div.className = `spinner-border text-light`
    let span = document.createElement(`span`)
    span.innerHTML = `cargando...`
    span.className = `visually-hidden`
    div.appendChild(span)
    listaPeliculas.append(div)
    setTimeout(() => {
        listaPeliculas.innerHTML = ``
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${busqueda}&type=movie`)
            .then(response => response.json())
            .then(data => {
            mostrarPeliculas(data.Search);
    })
   }, 1000) 
}

const mostrarFavoritos = () => {
    let local = JSON.parse(localStorage.getItem("favoritos"))
    listaFavoritos.innerHTML = ``
    if (local) {
        local.map((item) => {
            let contenedor = document.createElement(`div`)
            let imagen = document.createElement(`img`)
            let contenedorInfo = document.createElement(`div`)
            let titulo = document.createElement(`h3`)
            let boton = document.createElement(`a`)
            contenedor.className = `card m-2 text-center border-dark`
            contenedor.style = `width: 19rem;`
            imagen.src = item.Poster
            imagen.alt = item.Title
            imagen.className = `card-img-top`
            contenedorInfo.className = `card-body`
            titulo.innerHTML = item.Title
            titulo.className = `card-title h4 mb-4 text-white`
            boton.href = `#`
            boton.innerHTML = `Eliminar`
            boton.className = `btn btn-danger btnFavorito`
            boton.dataset.id = item.imdbID
            boton.addEventListener(`click`, (e) => {
                e.preventDefault()
                eliminarFavorito(e.target.dataset.id)
                mostrarFavoritos()
            })
            contenedorInfo.append(titulo, boton)
            if (item.Poster !== `N/A`) {
                contenedor.append(imagen)
            }
            contenedor.append(contenedorInfo)
            listaFavoritos.append(contenedor)
        })
    } else {
        listaPeliculas.innerHTML = `No se encontraron resultados`
    }
}

const mostrarPeliculas = (peliculas) => {
    listaPeliculas.innerHTML = ``
    if (peliculas) {
        peliculas.map((item) => {
            let contenedor = document.createElement(`div`)
            let imagen = document.createElement(`img`)
            let contenedorInfo = document.createElement(`div`)
            let titulo = document.createElement(`h3`)
            let categoria = document.createElement(`p`)
            let boton = document.createElement(`a`)
            contenedor.className = `card m-2 text-center border-dark`
            contenedor.style = `width: 19rem;`
            imagen.src = item.Poster
            imagen.alt = item.Title
            imagen.className = `card-img-top`
            contenedorInfo.className = `card-body`
            titulo.innerHTML = item.Title
            titulo.className = `card-title h4 text-white`
            categoria.innerHTML = item.Year
            categoria.className = `card-text text-white`
            boton.href = `#`
            boton.innerHTML = `Agregar a favoritos`
            boton.className = `btn btn-danger btnFavorito`
            boton.dataset.id = item.imdbID
            boton.dataset.titulo = item.Title
            boton.dataset.img = item.Poster
            boton.addEventListener(`click`, (e) => {
                notificacion()
                e.preventDefault()
                agregarFavorito(e.target.dataset.id, e.target.dataset.titulo, e.target.dataset.img)
            })
            contenedorInfo.append(titulo, categoria, boton)
            if (item.Poster !== `N/A`) {
                contenedor.append(imagen)
            }
            contenedor.append(contenedorInfo)
            listaPeliculas.append(contenedor)
        })
    } else {
        listaPeliculas.innerHTML = `No se encontraron resultados`
    }
}

const verBuscador = () => {
    vistaFavoritos.className = `d-none`
    vistaBuscador.className = ``
    vistaTrailers.className = `d-none`
}

const verFavoritos = () => {
    vistaFavoritos.className = ``
    vistaBuscador.className = `d-none`
    vistaTrailers.className = `d-none`
}

const verTrailers = () => {
    vistaFavoritos.className = `d-none`
    vistaBuscador.className = `d-none`
    vistaTrailers.className = ``
}

btnVistaBuscador.addEventListener(`click`, (e) => {
    verBuscador()
})

btnVistaFavoritos.addEventListener(`click`, (e) => {
    verFavoritos()
    mostrarFavoritos()
})

btnVistaTrailers.addEventListener(`click`, (e) => {
    verTrailers()
})

btnBuscar.addEventListener(`click`, (e) => {
    vistaFavoritos.className = `d-none`
    vistaBuscador.className = ``
    vistaTrailers.className = `d-none`
    e.preventDefault();
    traerPeliculas(inputBusqueda.value);
})

btnEliminarLocal.addEventListener(`click`, () => {
    localStorage.favoritos = JSON.stringify([])
    mostrarFavoritos()
})

window.addEventListener(`offline`, (e) => {
    listaPeliculas.innerHTML = `No tienes conexion a internet`
    listaFavoritos.innerHTML = `No tienes conexion a internet`
})

window.addEventListener(`online`, (e) => {
    listaPeliculas.innerHTML = ``
    listaFavoritos.innerHTML = ``
})
