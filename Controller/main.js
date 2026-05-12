// ===================== UTILIDADES =====================

function obtenerEmpleados() {
    return JSON.parse(localStorage.getItem("empleados")) || [];
}

function guardarEmpleados(lista) {
    localStorage.setItem("empleados", JSON.stringify(lista));
}

// ===================== MOSTRAR/OCULTAR FORM =====================

function crearEmpleado() {
    const div = document.getElementById("divAgregarEmpleado");
    div.style.display = div.style.display === "none" || div.style.display === "" ? "block" : "none";
}

// ===================== CREAR =====================

function agregarEmpleado() {
    const cc              = document.getElementById("cc").value.trim();
    const nombre_apellido = document.getElementById("nombre_apellido").value.trim();
    const direccion       = document.getElementById("direccion").value.trim();
    const email           = document.getElementById("email").value.trim();
    const telefono        = document.getElementById("telefono").value.trim();
    const sueldoBase      = parseFloat(document.getElementById("sueldoBase").value);
    const tipodeEmpleado  = document.getElementById("tipodeEmpleado").value;
    const tipodebono      = document.getElementById("tipodebono").value;

    if (!cc || !nombre_apellido || !direccion || !email || !telefono || isNaN(sueldoBase)) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const lista = obtenerEmpleados();

    if (lista.find(e => e.cc === cc)) {
        alert("Ya existe un empleado con esa CC.");
        return;
    }

    let adicion = 0;
    if (tipodebono === "A") adicion = 200000;
    else if (tipodebono === "B") adicion = 150000;
    else if (tipodebono === "C") adicion = 100000;
    else if (tipodebono === "D") adicion = 50000;

    const sueldoTotal = sueldoBase + adicion;

    let empleado;
    if (tipodeEmpleado === "Fijo") {
        empleado = new Fijo(cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado, tipodebono, telefono);
    } else {
        empleado = new Contrato(telefono, cc, nombre_apellido, direccion, email, sueldoBase, tipodeEmpleado, tipodebono);
    }

    lista.push({ cc, nombre_apellido, direccion, email, telefono, sueldoBase, tipodeEmpleado, tipodebono, sueldoTotal });

    guardarEmpleados(lista);
    document.getElementById("formEmpleado").reset();
    document.getElementById("divAgregarEmpleado").style.display = "none";
    renderTabla();
}

// ===================== LEER / RENDERIZAR =====================

function renderTabla() {
    const lista = obtenerEmpleados();
    const tbody = document.querySelector("#tablaEmpleados tbody");
    tbody.innerHTML = "";

    lista.forEach((emp, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${index + 1}.</td>
            <td>${emp.cc}</td>
            <td>${emp.nombre_apellido}</td>
            <td>${emp.direccion}</td>
            <td>${emp.email}</td>
            <td>${emp.telefono}</td>
            <td>$${emp.sueldoBase.toLocaleString()}</td>
            <td>${emp.tipodeEmpleado}</td>
            <td>${emp.tipodebono}</td>
            <td>$${emp.sueldoTotal.toLocaleString()}</td>
            <td><button type="button" class="btn btn-warning btn-sm" onclick="abrirModalActualizar('${emp.cc}')">Actualizar</button></td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="eliminarEmpleado('${emp.cc}')">Eliminar</button></td>
        `;
        tbody.appendChild(fila);
    });

    const total = hallarTotalNomina(lista);
    const filaTotal = document.createElement("tr");
    filaTotal.className = "fila-total";
    filaTotal.innerHTML = `
        <td colspan="9" class="text-end fw-bold">Total Nómina Mensual:</td>
        <td colspan="3" class="fw-bold">$${total.toLocaleString()}</td>
    `;
    tbody.appendChild(filaTotal);
}

// ===================== TOTAL NÓMINA =====================

function hallarTotalNomina(lista) {
    return lista.reduce((acc, emp) => acc + emp.sueldoTotal, 0);
}

// ===================== ELIMINAR =====================

function eliminarEmpleado(cc) {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
    let lista = obtenerEmpleados();
    lista = lista.filter(e => e.cc !== cc);
    guardarEmpleados(lista);
    renderTabla();
}

// ===================== ACTUALIZAR =====================

function abrirModalActualizar(cc) {
    const lista = obtenerEmpleados();
    const emp = lista.find(e => e.cc === cc);
    if (!emp) return;

    document.getElementById("editCC").value           = emp.cc;
    document.getElementById("editNombre").value       = emp.nombre_apellido;
    document.getElementById("editDireccion").value    = emp.direccion;
    document.getElementById("editEmail").value        = emp.email;
    document.getElementById("editTelefono").value     = emp.telefono;
    document.getElementById("editSueldo").value       = emp.sueldoBase;
    document.getElementById("editTipoEmpleado").value = emp.tipodeEmpleado;
    document.getElementById("editTipodebono").value   = emp.tipodebono;

    new bootstrap.Modal(document.getElementById("modalActualizar")).show();
}

function guardarActualizacion() {
    const cc              = document.getElementById("editCC").value;
    const nombre_apellido = document.getElementById("editNombre").value.trim();
    const direccion       = document.getElementById("editDireccion").value.trim();
    const email           = document.getElementById("editEmail").value.trim();
    const telefono        = document.getElementById("editTelefono").value.trim();
    const sueldoBase      = parseFloat(document.getElementById("editSueldo").value);
    const tipodeEmpleado  = document.getElementById("editTipoEmpleado").value;
    const tipodebono      = document.getElementById("editTipodebono").value;

    if (!nombre_apellido || !direccion || !email || !telefono || isNaN(sueldoBase)) {
        alert("Completa todos los campos.");
        return;
    }

    let adicion = 0;
    if (tipodebono === "A") adicion = 200000;
    else if (tipodebono === "B") adicion = 150000;
    else if (tipodebono === "C") adicion = 100000;
    else if (tipodebono === "D") adicion = 50000;

    const sueldoTotal = sueldoBase + adicion;

    let lista = obtenerEmpleados();
    const idx = lista.findIndex(e => e.cc === cc);
    if (idx !== -1) {
        lista[idx] = { cc, nombre_apellido, direccion, email, telefono, sueldoBase, tipodeEmpleado, tipodebono, sueldoTotal };
    }

    guardarEmpleados(lista);
    bootstrap.Modal.getInstance(document.getElementById("modalActualizar")).hide();
    renderTabla();
}

// ===================== BUSCAR =====================

function abrirModalBuscar() {
    document.getElementById("resultadoBusqueda").innerHTML = "";
    document.getElementById("inputBuscar").value = "";
    new bootstrap.Modal(document.getElementById("modalBuscar")).show();
}

function buscarEmpleado() {
    const termino = document.getElementById("inputBuscar").value.trim().toLowerCase();
    const lista = obtenerEmpleados();
    const resultados = lista.filter(e =>
        e.cc.includes(termino) || e.nombre_apellido.toLowerCase().includes(termino)
    );

    const div = document.getElementById("resultadoBusqueda");
    if (resultados.length === 0) {
        div.innerHTML = "<p class='text-danger'>No se encontraron empleados.</p>";
        return;
    }

    div.innerHTML = resultados.map(emp => `
        <div class="alert alert-info">
            <strong>CC:</strong> ${emp.cc} | <strong>Nombre:</strong> ${emp.nombre_apellido}<br>
            <strong>Dirección:</strong> ${emp.direccion} | <strong>Email:</strong> ${emp.email}<br>
            <strong>Teléfono:</strong> ${emp.telefono} | <strong>Sueldo Base:</strong> $${emp.sueldoBase.toLocaleString()}<br>
            <strong>Tipo Empleado:</strong> ${emp.tipodeEmpleado} | <strong>Bonificación:</strong> ${emp.tipodebono}<br>
            <strong>Sueldo Total:</strong> $${emp.sueldoTotal.toLocaleString()}
        </div>
    `).join("");
}

// ===================== INICIALIZAR =====================

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("divAgregarEmpleado").style.display = "none";
    renderTabla();
});