// Url's
const urlRecetas = "http://localhost:8080/recetas/";
const urlIngredientes = "http://localhost:8080/alimentos/";


// Eventos

// Evento para cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function(eventDOM) {
    if (isUserLogged()) {
        obtenerRecetas();
    }
})
// Evento para mostrar las recetas
document.getElementById('btnMostrarRecetas').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('filtroNombre').value = '';
    document.getElementById('filtroMomento').value = 0;
    document.getElementById('filtroTipo').value = 0;
    obtenerRecetas();
});

//Eventos para obtener las recetas filtradas
document.getElementById('btnBuscarFiltro').addEventListener('click', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('filtroNombre').value;
    const momento = document.getElementById('filtroMomento').value;
    const tipo = document.getElementById('filtroTipo').value;
    console.log("Nombre: ", nombre);
    console.log("Momento: ", momento);
    console.log("Tipo: ", tipo);
    obtenerRecetasFiltradas(nombre, momento, tipo);
});


// Eventos para los botones de eliminación

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('Eliminar')) {
        var idRecetaEliminar = event.target.closest('tr').value;
        if (confirm('¿Está seguro que desea eliminar la receta?')) {
            eliminarReceta(idRecetaEliminar);
        } else {
            return;
        }
    }
});



// Eventos para los botones de edición
document.addEventListener('click', function(event) {
    // Verificamos si el clic se hizo en un botón con la clase 'Editar'
    if (event.target && event.target.classList.contains('Editar')) {
        var formEditar = document.getElementById('formularioEditarReceta');
        var formAgregar = document.getElementById('formularioReceta');

        if (formAgregar.style.display === 'block') {
            formAgregar.style.display = 'none';
        }

        var idReceta = event.target.closest('tr').value;

        obtenerReceta(idReceta);
        obtenerIngredientesEditar();
        // Mostramos u ocultamos el formulario de editar
        if (formEditar.style.display === 'none' || formEditar.style.display === '') {
            formEditar.style.display = 'block';
        } else {
            formEditar.style.display = 'none';
        }
    }
});
let ingredientesAgregadosEditar = [];
document.getElementById('agregarIngredienteEditar').addEventListener('click', function(event) {
    event.preventDefault();
    const ingredienteSelect = document.getElementById('ingredienteIdEditar');
    const ingredienteId = ingredienteSelect.value;
    const ingredienteNombre = ingredienteSelect.options[ingredienteSelect.selectedIndex].text;
    const cantidad = document.getElementById('cantidadIngredienteEditar').value;

    if (ingredienteId && cantidad > 0) {
        const ingrediente = {
            alimento_id: ingredienteId,
            nombre: ingredienteNombre,
            cantidad: parseFloat(cantidad)
        };
        ingredientesAgregadosEditar.push(ingrediente);

        mostrarIngredientesEditar();
        
        ingredienteSelect.value = '';
        document.getElementById('cantidadIngredienteEditar').value = '';
    } else {
        alert('Seleccione un ingrediente válido y una cantidad mayor a 0.');
    }
});
let idRecetaActualizar = 0;
document.getElementById('formEditarReceta').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombreReceta = document.getElementById('nombreRecetaEditar').value;
    const momentoReceta = parseInt(document.getElementById('momentoRecetaEditar').value);

    if (!(nombreReceta && ingredientesAgregadosEditar.length > 0)) {
        alert('Complete todos los campos antes de actualizar la receta.');
        return;
    }

    const receta = {
        id: idRecetaActualizar,
        nombre: nombreReceta,
        momento_consumo: momentoReceta,
        ingredientes: ingredientesAgregadosEditar
    };
    console.log("Receta a actualizar: ", receta);
    actualizarReceta(receta);
    
});

// Evento para desplegar el formulario de carga de receta
document.getElementById('btnAgregarReceta').addEventListener('click', function() {
    var formAgregar = document.getElementById('formularioReceta');
    var formEditar = document.getElementById('formularioEditarReceta');

    // Si el formulario de editar está abierto, lo cerramos
    if (formEditar.style.display === 'block') {
        formEditar.style.display = 'none';
    }

    // Mostramos u ocultamos el formulario de agregar receta
    if (formAgregar.style.display === 'none' || formAgregar.style.display === '') {
        formAgregar.style.display = 'block';
    } else {
        formAgregar.style.display = 'none';
    }
});

// Evento para el botón de agregar ingrediente 
let ingredientesAgregados = [];
document.getElementById('agregarIngrediente').addEventListener('click', function(event) {
    event.preventDefault();
    const ingredienteSelect = document.getElementById('ingredienteId1');
    const ingredienteId = ingredienteSelect.value;
    const ingredienteNombre = ingredienteSelect.options[ingredienteSelect.selectedIndex].text;
    const cantidad = document.getElementById('cantidadIngrediente1').value;

    // Verificar que se haya seleccionado un ingrediente y una cantidad válida
    if (ingredienteId && cantidad > 0) {
        // Crear un objeto de ingrediente y añadirlo al array
        const ingrediente = {
            alimento_id: ingredienteId,
            nombre: ingredienteNombre,
            cantidad: parseFloat(cantidad)
        };
        ingredientesAgregados.push(ingrediente);

        // Actualizar la lista de ingredientes mostrados
        mostrarIngredientes();
        
        // Limpiar los campos después de agregar
        ingredienteSelect.value = '';
        document.getElementById('cantidadIngrediente1').value = '';
    } else {
        alert('Seleccione un ingrediente válido y una cantidad mayor a 0.');
    }
});

// Evento para el boton de agregar receta
document.getElementById('formAgregarReceta').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Obtener los valores correctamente de los campos de texto y select
    const nombreReceta = document.getElementById('nombreReceta').value;  // Asegurarse de obtener el valor del input
    const momentoReceta = parseInt(document.getElementById('momentoReceta').value);  // Asegurarse de obtener el valor del select

    // Verificar que se haya completado el nombre de la receta y al menos un ingrediente
    if (!(nombreReceta && ingredientesAgregados.length > 0)) {
        alert('Complete todos los campos antes de guardar la receta.');
        return;
    }

    // Estructuramos el objeto receta con el nombre, el momento y los ingredientes
    const receta = {
        nombre: nombreReceta,
        momento_consumo: momentoReceta,  // Usar el valor correcto del select
        ingredientes: ingredientesAgregados  // Array de ingredientes agregados
    };
    
    try {
        agregarReceta(receta);  // Enviar los datos al backend
    } catch (error) {
        console.error("Error [agregarReceta]: ", error);
    }
});

// Evento para el select de momento de receta
document.getElementById('momentoReceta').addEventListener('change', function() {
    obtenerIngredientes();
});

// Evento para el select de momento de receta al momento de editar
document.getElementById('momentoRecetaEditar').addEventListener('change', function() {
    obtenerIngredientesEditar();
}); 

// Evento para borrar el ultimo ingrediente en el formulario de agregar receta
document.getElementById('borrarIngrediente').addEventListener('click', function(event) {
    event.preventDefault();
    ingredientesAgregados.pop();
    mostrarIngredientes();
});

// Evento para borrar el ultimo ingrediente en el formulario de editar receta
document.getElementById('borrarIngredienteEditar').addEventListener('click', function(event) {
    event.preventDefault();
    ingredientesAgregadosEditar.pop();
    mostrarIngredientesEditar();

});

// Funciones 

// Función para obtener las recetas y mostrarlas en la tabla
async function obtenerRecetas() {
    try {
        await makeRequest(`${urlRecetas}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerRecetas, errorFunctionObtenerRecetas); //CallType debe ser PRIVATE
    } catch (error) {
        console.error("Error [obtenerRecetas]: ", error?.message || error)
    }
}
function errorFunctionObtenerRecetas(status, response) {
    if (status != 404) {
        alert("Error " + status + ":\n" + response.error);
        return;
    }
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = "No hay recetas disponibles";
    cell.colSpan = 4;
    row.appendChild(cell);
    tbody.appendChild(row);
}
function successObtenerRecetas(data) {
    const tbody = document.querySelector("tbody"); // Seleccionar el cuerpo de la tabla

    // Limpiar la tabla antes de agregar los nuevos datos
    tbody.innerHTML = "";

    // Recorrer los datos obtenidos (las recetas)
    data.forEach(receta => {
        const row = document.createElement("tr"); // Crear una fila

        // Crear una celda para el nombre de la receta
        const nombreCell = document.createElement("td");
        nombreCell.textContent = receta.nombre;
        row.appendChild(nombreCell);

        // Crear una celda para el momento de consumo (desayuno, almuerzo, etc.)
        const momentoCell = document.createElement("td");
        momentoCell.textContent = obtenerNombreMomento(receta.momento_consumo); 
        row.appendChild(momentoCell);

        // Crear una celda para los ingredientes
        const ingredientesCell = document.createElement("td");

        // Convertir el array de ingredientes a un string
        const ingredientesString = receta.ingredientes
            .map(ing => `${ing.nombre} (${ing.cantidad} g)`)
            .join(",");
        ingredientesCell.textContent = ingredientesString;

        row.appendChild(ingredientesCell);

        // Crear una celda para los botones de acción
        const accionesCell = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-primary Editar";
        btnEditar.textContent = "Editar";
        
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger Eliminar";
        btnEliminar.textContent = "Eliminar";
        
        // Agregar los botones a la celda de acciones
        accionesCell.appendChild(btnEditar);
        accionesCell.appendChild(btnEliminar);

        row.appendChild(accionesCell);
        row.value = receta.id;
        // Agregar la fila al tbody
        tbody.appendChild(row);
    });
}

// Función para obtener los ingredientes y mostrarlos en el select
async function obtenerIngredientes() {
    try {
        await makeRequest(`${urlIngredientes}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerIngredientes, errorFunction); //CallType debe ser PRIVATE
    } catch (error) {
        console.error("Error [obtenerIngredientes]: ", error?.message || error)
    }
}

// Función para obtener los ingredientes y mostrarlos en el select de editar
async function obtenerIngredientesEditar() {
    try {
        await makeRequest(`${urlIngredientes}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerIngredientesEditar, errorFunction); //CallType debe ser PRIVATE 
    } catch (error) {
        console.error("Error [obtenerIngredientes]: ", error?.message || error)
    }
}


function successObtenerIngredientes(data) {
    const momentoSeleccionado = parseInt(document.getElementById('momentoReceta').value); // Convertir el valor a número entero

    const selectIngrediente = document.getElementById('ingredienteId1');
    selectIngrediente.innerHTML = '<option value="">Seleccione un ingrediente</option>'; // Limpiar el select
    
    // Filtramos los ingredientes que contienen el momento seleccionado en su array de momentos
    data.forEach(alimento => {
        if (alimento.momentos_de_consumo.includes(momentoSeleccionado)) { // Verificamos si el array contiene el momento seleccionado
            const option = document.createElement('option');
            option.value = alimento.id;
            option.textContent = alimento.nombre;
            selectIngrediente.appendChild(option); // Añadir al select
        }
    });
}

function successObtenerIngredientesEditar(data) {
    const momentoSeleccionado = parseInt(document.getElementById('momentoRecetaEditar').value); // Convertir el valor a número entero

    const selectIngrediente = document.getElementById('ingredienteIdEditar');
    selectIngrediente.innerHTML = '<option value="">Seleccione un ingrediente</option>'; // Limpiar el select
    
    // Filtramos los ingredientes que contienen el momento seleccionado en su array de momentos
    data.forEach(alimento => {
        if (alimento.momentos_de_consumo.includes(momentoSeleccionado)) { // Verificamos si el array contiene el momento seleccionado
            const option = document.createElement('option');
            option.value = alimento.id;
            option.textContent = alimento.nombre;
            selectIngrediente.appendChild(option); // Añadir al select
        }
    });
}

// Función para agregar receta
async function agregarReceta(receta) {
    try {

        await makeRequest(`${urlRecetas}`, Method.POST, receta, ContentType.JSON, CallType.PRIVATE, successAgregarReceta, errorFunction);
    } catch (error) {
        console.error("Error [agregarReceta]: ", error?.message || error);
    }
}

function successAgregarReceta(data) {
    alert('Receta guardada exitosamente!');
    // Limpiar el formulario y el array de ingredientes
    document.getElementById('formAgregarReceta').reset();
    ingredientesAgregados = [];
    document.getElementById('listaIngredientes').innerHTML = '';  // Limpiar la visualización de ingredientes
    obtenerRecetas();
}
// Función para obtener una receta
async function obtenerReceta(id) {
    try {
        await makeRequest(`${urlRecetas}${id}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerReceta, errorFunction); //CallType debe ser PRIVATE
    } catch (error) {
        console.error("Error [obtenerReceta]: ", error?.message || error)
    }
}

function successObtenerReceta(data) {
    document.getElementById('nombreRecetaEditar').value = data.nombre;
    document.getElementById('momentoRecetaEditar').value = data.momento_consumo;
    idRecetaActualizar = data.id;
    ingredientesAgregadosEditar = [];
    const listaIngredientes = document.getElementById('listaIngredientesEditar');
    listaIngredientes.innerHTML = ''; 
    let contador = 1;
    console.log("ingredientes antes de ser añadidos:" + ingredientesAgregadosEditar);
    data.ingredientes.forEach(ingrediente => {
        ingredientesAgregadosEditar.push(ingrediente);
        const li = document.createElement('li');
        li.textContent = `${contador}) ${ingrediente.nombre}: ${ingrediente.cantidad} gramos`;
        listaIngredientes.appendChild(li);
        contador++;
        
    });
    console.log("ingredientes después de ser añadidos:" + ingredientesAgregadosEditar);
}
// Funcion para actualizar una receta
async function actualizarReceta(receta) {
    try {
        await makeRequest(`${urlRecetas}${receta.id}`, Method.PUT, receta, ContentType.JSON, CallType.PRIVATE, successActualizarReceta, errorFunction);
    } catch (error) {
        console.error("Error [actualizarReceta]: ", error?.message || error);
    }
}
function successActualizarReceta(data) {
    alert('Receta actualizada exitosamente!');
    document.getElementById('formEditarReceta').reset();
    ingredientesAgregadosEditar = [];
    document.getElementById('listaIngredientesEditar').innerHTML = '';
    obtenerRecetas();
    document.getElementById('formularioEditarReceta').style.display = 'none';
}

// Función para eliminar una receta
async function eliminarReceta(id) {
    try {
        await makeRequest(`${urlRecetas}${id}`, Method.DELETE, null, ContentType.JSON, CallType.PRIVATE, successEliminarReceta, errorFunction); 
    } catch (error) {
        console.error("Error [eliminarReceta]: ", error?.message || error);
    }
}
function successEliminarReceta(data) {
    alert('Receta eliminada exitosamente!');
    obtenerRecetas();
    
}

// Función para obtener recetas filtradas
async function obtenerRecetasFiltradas(nombre, momento, tipo) {
    try {
        // Crear objeto URLSearchParams para manejar los parámetros dinámicamente
        const params = new URLSearchParams();

        // Agregar solo 'nombre' si tiene un valor
        if (nombre) params.append('nombre', nombre);
        if (momento != 0) {
            params.append('momento', momento);
        }
        if (tipo != 0) {
            params.append('tipo', tipo);
        }
        // Construir la URL completa
        const url = `${urlRecetas}buscar?${params.toString()}`;
        console.log("URL: ", url);

        await makeRequest(url, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerRecetas, errorFunction);
    } catch (error) {
        console.error("Error [obtenerRecetasFiltradas]: ", error?.message || error);
    }
}


// Funciones auxiliares

function mostrarIngredientes() {
    const listaIngredientes = document.getElementById('listaIngredientes');
    listaIngredientes.innerHTML = ''; // Limpiar la lista
    let contador = 1;
    ingredientesAgregados.forEach(ingrediente => {
        const li = document.createElement('li');
        li.textContent = `${contador}) ${ingrediente.nombre}: ${ingrediente.cantidad} gramos`;
        listaIngredientes.appendChild(li);
        contador++;
    });
}

function mostrarIngredientesEditar() {
    const listaIngredientes = document.getElementById('listaIngredientesEditar');
    listaIngredientes.innerHTML = ''; // Limpiar la lista
    let contador = 1;
    ingredientesAgregadosEditar.forEach(ingrediente => {
        const li = document.createElement('li');
        li.textContent = `${contador}) ${ingrediente.nombre}: ${ingrediente.cantidad} gramos`;
        listaIngredientes.appendChild(li);
        contador++;
    });
}



function obtenerNombreMomento(momento) {
    switch (momento) {
        case 1:
            return "Desayuno";
        case 2:
            return "Almuerzo";
        case 3:
            return "Merienda";
        case 4:
            return "Cena";
        default:
            return "---";
    }
}

// Función para manejar errores en las funciones
function errorFunction(status, response) {
    alert("Error " + status + ":\n" + response.error);
}
