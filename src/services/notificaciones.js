const notificaciones = [];
let siguienteId = 1;

function crearNotificacion(pedidoId, mensaje) {
    const notificacion = {
        id: siguienteId++,
        pedidoId,
        mensaje,
        fecha: new Date().toISOString(),
        leida: false
    };

    notificaciones.push(notificacion);
    return notificacion;
}

function listarNotificaciones() {
    return notificaciones;
}

module.exports = {
    crearNotificacion,
    listarNotificaciones
};