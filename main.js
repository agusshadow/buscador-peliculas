// APIKEY
const apiKey = `cddd6530`;

// OBTENGO LOS ELEMENTOS DEL DOM
let inputBusqueda = document.getElementById(`busqueda`);
let btnBuscar = document.getElementById(`btnBuscar`);

let listaPeliculas = document.getElementById(`peliculas`);
let listaFavoritos = document.getElementById(`favoritos`);

let btnVistaBuscador = document.getElementById(`buscador`);
let btnVistaFavoritos = document.getElementById(`btnFavoritos`);
let vistaBuscador = document.getElementById(`vistaBuscador`);
let vistaFavoritos = document.getElementById(`vistaFavoritos`);


let btnAgregarFavorito = document.getElementsByClassName(`btnFavorito`)

// FUNCIONES
const eliminarFavorito = (id) => {
    local = JSON.parse(localStorage.favoritos)
    index = local.findIndex(item => item.imdbID === id)
    local.splice(index, 1)
    localStorage.favoritos = JSON.stringify(local)
}

const agregarFavorito = (id) => {
    if (!localStorage.favoritos) {
        localStorage.favoritos = JSON.stringify([])
    }
    if (localStorage.favoritos) {
        const esta = JSON.parse(localStorage.favoritos).find(({ imdbID }) => imdbID === id);
        if (!esta) {
            fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
            .then(response => response.json())
            .then(data => {
                let pelicula = {
                    imdbID: id,
                    Title : data.Title,
                    Poster: data.Poster,
                    Year: data.Year,
                }
                if (!localStorage.favoritos) {
                    localStorage.favoritos = JSON.stringify([pelicula])
                } else {
                    let local = JSON.parse(localStorage.getItem("favoritos"))
                    local.push(pelicula)
                    localStorage.favoritos = JSON.stringify(local)
                }
            })
        } 
    } else {
        console.log(`xd no hay nada`);
    }
   
}

const notificacion = async () => {
    document.body.append = `
    <div class="notificacion bg-success p-2 rounded-3">
          <p class="m-0 text-white">Agregada con exito</p>
    </div>
    `;
    console.log(`click`);
    /* await setTimeout(() => {
         listaPeliculas.innerHTML = ``
    }, 2000) */
}

const animacionCarga = async () => {
    listaPeliculas.innerHTML = `
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `;
    await setTimeout(() => {
         listaPeliculas.innerHTML = ``
    }, 2000)
}

const traerPeliculas = async (busqueda) => {
    await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${busqueda}&type=movie`)
    .then(response => response.json())
    .then(data => {
        mostrarPeliculas(data.Search);
    })
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
            let categoria = document.createElement(`p`)
            let boton = document.createElement(`a`)

            contenedor.className = `card p-2 my-2 text-center`
            contenedor.style = `width: 19rem;`

            imagen.src = item.Poster
            imagen.alt = item.Title
            imagen.className = `card-img-top`

            contenedorInfo.className = `card-body`

            titulo.innerHTML = item.Title
            titulo.className = `card-title h4 mb-4`

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

            contenedor.className = `card p-2 my-2 text-center`
            contenedor.style = `width: 19rem;`

            imagen.src = item.Poster
            imagen.alt = item.Title
            imagen.className = `card-img-top`

            contenedorInfo.className = `card-body`

            titulo.innerHTML = item.Title
            titulo.className = `card-title h4`

            categoria.innerHTML = item.Year
            categoria.className = `card-text`

            boton.href = `#`
            boton.innerHTML = `Agregar a favoritos`
            boton.className = `btn btn-danger btnFavorito`
            boton.dataset.id = item.imdbID
            boton.addEventListener(`click`, (e) => {
                notificacion()
                e.preventDefault()
                agregarFavorito(e.target.dataset.id)
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
}

const verFavoritos = () => {
    vistaFavoritos.className = ``
    vistaBuscador.className = `d-none`
}

// LISTENERS
btnVistaBuscador.addEventListener(`click`, (e) => {
    verBuscador()
})

btnVistaFavoritos.addEventListener(`click`, (e) => {
    verFavoritos()
    mostrarFavoritos()
})

btnBuscar.addEventListener(`click`, (e) => {
    vistaFavoritos.className = `d-none`
    vistaBuscador.className = ``
    e.preventDefault();
    traerPeliculas(inputBusqueda.value);
})




