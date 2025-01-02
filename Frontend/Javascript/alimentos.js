// Eventos del DOM
document.addEventListener("DOMContentLoaded", function(eventDOM) {
    if (isUserLogged()) {
        obtenerAlimentos();
    }
});
// Funciones de Manipulación del DOM
function limpiarFormulario() {
    document.getElementById('formAgregarAlimento').reset();
    document.getElementById('formularioAlimento').removeAttribute('data-id');
    document.querySelectorAll('#momentoAlimento .form-check-input').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('formularioAlimento').style.display = 'none';
}

function mostrarFormulario() {
    document.getElementById('formularioAlimento').style.display = 'block';
}

function ocultarFormulario() {
    document.getElementById('formularioAlimento').style.display = 'none';
}

document.getElementById('btnAgregarAlimento').addEventListener('click', function() {
    limpiarFormulario();
    mostrarFormulario();
});

document.getElementById('formAgregarAlimento').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombreAlimento').value;
    const tipo = document.getElementById('tipoAlimento').value;
    const momentos = Array.from(document.querySelectorAll('#momentoAlimento .form-check-input:checked')).map(checkbox => checkbox.value);
    const precio = document.getElementById('precioAlimento').value;
    const stock = document.getElementById('stockAlimento').value;
    const cantidadMinima = document.getElementById('cMinimaAlimento').value;

    if (!nombre || !tipo || !precio || !stock || !cantidadMinima) {
        alert('Por favor, complete todos los campos');
        return;
    } 
    if (momentos.length === 0) {
        alert('Por favor, seleccione al menos un momento de consumo');
        return;
    }
    const nuevoAlimento = {
        nombre: nombre,
        tipo: parseInt(tipo),
        momentos_de_consumo: momentos.map(m => parseInt(m)),
        precio_unitario: parseFloat(precio),
        cantidad_actual: parseFloat(stock),
        cantidad_minima: parseFloat(cantidadMinima)
    };

    const id = document.getElementById('formularioAlimento').getAttribute('data-id');
    if (id) {
        await modificarAlimento(id, nuevoAlimento);
    } else {
        await agregarAlimento(nuevoAlimento);
    }
});

// Función para cargar los datos del alimento en el formulario
async function cargarAlimento(id) {
    try {
        await makeRequest(
            `http://localhost:8080/alimentos/${id}`, // URL de la API
            Method.GET,                              // Método HTTP
            null,                                    // No se envían datos en un GET
            ContentType.JSON,                        // Tipo de contenido es JSON
            CallType.PRIVATE,                         // Tipo de llamada (pública)
            (alimento) => {                          // Callback en caso de éxito
                document.getElementById('nombreAlimento').value = alimento.nombre;
                document.getElementById('tipoAlimento').value = alimento.tipo;
                document.querySelectorAll('#momentoAlimento .form-check-input').forEach(checkbox => {
                    checkbox.checked = alimento.momentos_de_consumo.includes(parseInt(checkbox.value));
                });
                document.getElementById('precioAlimento').value = alimento.precio_unitario;
                document.getElementById('stockAlimento').value = alimento.cantidad_actual;
                document.getElementById('cMinimaAlimento').value = alimento.cantidad_minima;
                document.getElementById('formularioAlimento').setAttribute('data-id', id);
                mostrarFormulario();
            },
            errorFunction                            // Callback en caso de error
        );
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
// Funciones de Solicitud HTTP
async function obtenerAlimentos() {
    try {
        await makeRequest(
            'http://localhost:8080/alimentos/', // URL de la API
            Method.GET,                        // Método HTTP
            null,                              // No se envían datos en un GET
            ContentType.JSON,                  // Tipo de contenido es JSON
            CallType.PRIVATE,                  // Tipo de llamada 
            (alimentos) => {                   // Callback en caso de éxito
                const tableBody = document.getElementById('alimentos-table-body');
                tableBody.innerHTML = ''; // Limpiar el cuerpo de la tabla
                if (alimentos && Array.isArray(alimentos)) {
                    alimentos.forEach(alimento => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${alimento.nombre}</td>
                            <td>${obtenerNombreTipo(alimento.tipo)}</td>
                            <td>${alimento.momentos_de_consumo.map(ing => obtenerNombreMomento(ing)).join(", ")}</td>
                            <td>${alimento.precio_unitario}</td>
                            <td>${alimento.cantidad_actual}</td>
                            <td>${alimento.cantidad_minima}</td>
                            <td>
                                <button class="btn btn-warning btnModificar" data-id="${alimento.id}">Modificar</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btnEliminar" data-id="${alimento.id}">Eliminar</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });

                    // Agregar eventos a los botones de modificar
                    document.querySelectorAll('.btnModificar').forEach(button => {
                        button.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            cargarAlimento(id);
                        });
                    });
                    document.querySelectorAll('.btnEliminar').forEach(button => {
                        button.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            if (confirm('¿Está seguro que desea eliminar este alimento?')) {
                                eliminarAlimento(id);
                            }
                        });
                    });
                }
            },
            (status, error) => {               // Callback en caso de error
                console.error('Error fetching alimentos:', status, error);
            }
        );
    } catch (error) {
        console.error('Error in fetchAlimentos:', error);
    }
}

async function modificarAlimento(id, alimento) {
    const url = `http://localhost:8080/alimentos/${id}`;
    try {
        await makeRequest(
            url,                                  // URL de la API
            Method.PUT,                           // Método HTTP
            alimento,                             // Datos del alimento a modificar
            ContentType.JSON,                     // Tipo de contenido es JSON
            CallType.PRIVATE,                      // Tipo de llamada (pública)
            (response) => {                       // Callback en caso de éxito
                console.log('Alimento modificado:', response);
                obtenerAlimentos();               // Recargar la lista de alimentos
                limpiarFormulario();
            },
            errorFunction                         // Callback en caso de error
        );
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function agregarAlimento(alimento) {
    const url = 'http://localhost:8080/alimentos/';
    try {
        await makeRequest(
            url,                                  // URL de la API
            Method.POST,                          // Método HTTP
            alimento,                             // Datos del nuevo alimento
            ContentType.JSON,                     // Tipo de contenido es JSON
            CallType.PRIVATE,                      // Tipo de llamada (pública)
            (response) => {                       // Callback en caso de éxito
                console.log('Alimento agregado:', response);
                obtenerAlimentos();               // Recargar la lista de alimentos
                limpiarFormulario();
            },
            errorFunction                         // Callback en caso de error
        );
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

async function eliminarAlimento(id) {
    const url = `http://localhost:8080/alimentos/${id}`;
    try {
        await makeRequest(
            url, 
            Method.DELETE,
            null,
            ContentType.JSON,
            CallType.PRIVATE,
            (response) => {
                console.log('Alimento eliminado:', response);
                obtenerAlimentos();
            },
            errorFunction
        );
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
// Funciones de Utilidad
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
function obtenerNombreTipo(tipo) {
    switch (tipo) {
        case 1:
            return "Verdura";
        case 2:
            return "Lacteo";
        case 3:
            return "Queso";
        case 4:
            return "Legumbre";
        case 5:
            return "Carne";
        case 6:
            return "Fruta";
        default:
            return "---";
    }
}
// Función para manejar errores en las funciones
function errorFunction(status, response) {
    alert("Error " + status + ":\n" + response.error);
}