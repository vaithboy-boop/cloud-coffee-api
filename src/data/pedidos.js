const pedidos = [];
let siguienteId = 1;

function crearPedido(datos) {
    const pedido = {
        id: siguienteId++,
        cliente: datos.cliente.trim(),
        productos: datos.productos,
        estado: 'RECIBIDO',
        fechaCreacion: new Date().toISOString()
    };

    pedidos.push(pedido);
    return pedido;
}

function listarPedidos() {
    return pedidos;
}

function buscarPedido(id) {
    return pedidos.find(pedido => pedido.id === Number(id));
}

function actualizarEstado(id, nuevoEstado) {
    const pedido = buscarPedido(id);

    if (!pedido) {
        return null;
    }

    pedido.estado = nuevoEstado;
    return pedido;
}

module.exports = {
    crearPedido,
    listarPedidos,
    buscarPedido,
    actualizarEstado
};