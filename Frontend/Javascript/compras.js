const urlCompras = 'http://localhost:8080/compras/';

// Eventos

// Evento para carga del DOM
document.addEventListener("DOMContentLoaded", function(eventDOM) {
    if (isUserLogged()) {
        obtenerCompras();
    }
})

// Evento para obtener productos a comprar
document.getElementById('btnBuscarAlimento').addEventListener('click', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreAlimento').value;
    const tipo = document.getElementById('tipoAlimento').value;
    obtenerProductosBajoStock(tipo, nombre);
    document.getElementById('btnNewPurchase').style.display = "none";
});

// Eventos para generar una compra
document.getElementById('btnNewPurchase').addEventListener('click', function(event) {
    event.preventDefault();

    generarCompra();
});
const purchaseModal = new bootstrap.Modal(document.getElementById('newPurchaseModal'));
document.getElementById('btnReturn').addEventListener('click', function(event) {
    event.preventDefault();
    purchaseModal.hide();
    obtenerCompras(); // Llamar a la función para obtener las compras
});

// Evento para mostrar el historial
document.getElementById('btnShowHistorial').addEventListener('click', function(event) {
    event.preventDefault();
    obtenerCompras();
    document.getElementById('btnNewPurchase').style.display = "none";
});
// Funciones
// Funciones para obtener las compras
async function obtenerCompras() {
    try {
        await makeRequest(`${urlCompras}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerCompras, errorFunctionCompra)
    } catch (error) {
        console.error(error);
    }
}

function successObtenerCompras(data) {
    document.getElementById('tituloTabla').textContent = "Historial de compras";

    const thead = document.querySelector("thead");
    thead.innerHTML = "";

    // Crear la fila de encabezado
    const headerRow = document.createElement("tr");

    const headers = ["Productos adquiridos", "Fecha de compra", "Costo total"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach(compra => {

        const row = document.createElement("tr");

        const productosCell = document.createElement("td");
        const productosString = compra.productos
        .map(producto => `${producto.nombre} (${producto.cantidad} g)`)
        .join(", ");
        productosCell.textContent = productosString;
        row.appendChild(productosCell);

        const fechaCell = document.createElement("td");
        const fecha = new Date(compra.fecha_compra);
        fechaCell.textContent = fecha.toLocaleString(); 
        row.appendChild(fechaCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = `$${compra.costo_total.toFixed(2)}`;
        row.appendChild(totalCell);

        row.value = compra.id;

        tbody.appendChild(row);
    });
}

// Funciones para obtener los productos con bajo stock

async function obtenerProductosBajoStock(tipo, nombre) {
    try {
        // Crear objeto URLSearchParams para manejar los parámetros dinámicamente
        const params = new URLSearchParams();

        // Agregar solo 'nombre' si tiene un valor
        if (nombre != "") params.append('nombre', nombre);

        if (tipo != 0) {
            params.append('tipo', tipo);
        }
        // Construir la URL completa
        const url = `${urlCompras}productos-cantidad?${params.toString()}`;
        console.log(url);
        await makeRequest(`${url}`, Method.GET, null, ContentType.JSON, CallType.PRIVATE, successObtenerProductosBajoStock, errorFunctionCompra)
    } catch (error) {
        console.error(error);
    }
}
function successObtenerProductosBajoStock(data) {
    document.getElementById('tituloTabla').textContent = "Productos con bajo stock";

    const thead = document.querySelector("thead");
    thead.innerHTML = "";

    // Crear la fila de encabezado
    const headerRow = document.createElement("tr");

    const headers = ["Producto", "Cantidad faltante en gramos", "Seleccionar"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach(producto => {
        const row = document.createElement("tr");

        const nombreCell = document.createElement("td");
        nombreCell.textContent = producto.nombre;
        row.appendChild(nombreCell);

        const cantidadCell = document.createElement("td");
        cantidadCell.textContent = producto.cantidad;
        row.appendChild(cantidadCell);

        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = producto.alimento_id; // Asigna el ID del producto como valor de la casilla
        // Aumentar tamaño del checkbox
        checkbox.style.transform = "scale(1.5)";
        checkbox.style.margin = "5px";
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        row.value = producto.id;

        tbody.appendChild(row);
    });
    const btnComprar = document.getElementById('btnNewPurchase');
    btnComprar.style.display = "block";
}


// Funciones para generar una compra
async function generarCompra() {
    try {
        const selectedIds = [];
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked'); 
        checkboxes.forEach(checkbox => {
            selectedIds.push(checkbox.value); 
        });
        const requestBody = {
            ids_compras_seleccionadas: selectedIds
        };
        console.log(requestBody);
        await makeRequest(`${urlCompras}`, Method.POST, requestBody, ContentType.JSON, CallType.PRIVATE, successGenerarCompra, errorFunctionCompra)
    } catch (error) {
        console.error(error);
    }
}
function successGenerarCompra(data) {
    const purchaseDetails = document.getElementById('purchaseDetails');
    
    // Limpiamos el contenido actual de purchaseDetails
    purchaseDetails.innerHTML = '';

    // Creación de elementos para mostrar los detalles de la compra
    const fecha = document.createElement("p");
    fecha.textContent = `Fecha: ${new Date(data.fecha_compra).toLocaleString()}`;

    const productos = document.createElement("p");
    console.log(data.productos);
    productos.textContent = `Productos: ${data.productos.map(producto => `${producto.nombre} (${producto.cantidad} g)`).join(", ")}`;

    const costoTotal = document.createElement("p");
    costoTotal.textContent = `Costo total: $${data.costo_total}`;

    // Agregamos los elementos al contenedor del modal
    purchaseDetails.appendChild(fecha);
    purchaseDetails.appendChild(productos);
    purchaseDetails.appendChild(costoTotal);

    // Mostrar el modal
    purchaseModal.show();
    document.getElementById('btnNewPurchase').style.display = "none";
}






// Funciones auxiliares

function errorFunctionCompra(status, response) {
    alert("Error " + status + "\n" + response.error);
}
