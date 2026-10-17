const express = require('express');
const router = express.Router();

const {
    crearPedido,
    listarPedidos,
    buscarPedido,
    actualizarEstado
} = require('../data/pedidos');

const {
    crearNotificacion
} = require('../services/notificaciones');

const estadosPermitidos = [
    'RECIBIDO',
    'PREPARANDO',
    'ENVIADO',
    'ENTREGADO',
    'CANCELADO'
];

// GET /api/pedidos
router.get('/', (req, res) => {
    res.json({
        mensaje: 'Lista de pedidos',
        data: listarPedidos()
    });
});

// POST /api/pedidos
router.post('/', (req, res) => {
    const { cliente, productos } = req.body;

    if (typeof cliente !== 'string' || !cliente.trim()) {
        return res.status(400).json({
            mensaje: 'El nombre del cliente es obligatorio'
        });
    }

    if (
        !Array.isArray(productos) ||
        productos.length === 0 ||
        !productos.every(producto =>
            producto &&
            Number.isInteger(producto.productoId) &&
            producto.productoId > 0 &&
            Number.isInteger(producto.cantidad) &&
            producto.cantidad > 0
        )
    ) {
        return res.status(400).json({
            mensaje: 'Debes incluir productos con productoId y cantidad válidos'
        });
    }

    const pedido = crearPedido({ cliente, productos });

    crearNotificacion(
        pedido.id,
        `Se registró el pedido #${pedido.id} del cliente ${pedido.cliente}`
    );

    return res.status(201).json({
        mensaje: 'Pedido registrado correctamente',
        data: pedido
    });
});

// GET /api/pedidos/:id
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El ID del pedido no es válido'
        });
    }

    const pedido = buscarPedido(id);

    if (!pedido) {
        return res.status(404).json({
            mensaje: 'Pedido no encontrado'
        });
    }

    return res.json({
        mensaje: 'Pedido encontrado',
        data: pedido
    });
});

// PATCH /api/pedidos/:id/estado
router.patch('/:id/estado', (req, res) => {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El ID del pedido no es válido'
        });
    }

    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            mensaje: 'Estado no permitido',
            estadosPermitidos
        });
    }

    const pedidoExistente = buscarPedido(id);

    if (!pedidoExistente) {
        return res.status(404).json({
            mensaje: 'Pedido no encontrado'
        });
    }

    const estadoAnterior = pedidoExistente.estado;
    const pedido = actualizarEstado(id, estado);

    if (estadoAnterior !== estado) {
        crearNotificacion(
            pedido.id,
            `El pedido #${pedido.id} cambió de ${estadoAnterior} a ${estado}`
        );
    }

    return res.json({
        mensaje: 'Estado del pedido actualizado',
        data: pedido
    });
});

module.exports = router;