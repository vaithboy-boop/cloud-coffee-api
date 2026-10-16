const express = require('express');
const inventario = require('../data/inventario');

const router = express.Router();
let siguienteId = Math.max(...inventario.map(item => item.id), 0) + 1;

// Consultar insumos
router.get('/', (req, res) => {
    res.json({
        mensaje: 'Inventario consultado correctamente',
        data: inventario
    });
});

// Consultar alertas de stock bajo
router.get('/alertas/stock-bajo', (req, res) => {
    const insumosBajos = inventario.filter(
        item => item.cantidad <= item.stockMinimo
    );

    res.json({
        mensaje: 'Consulta de stock bajo realizada',
        total: insumosBajos.length,
        data: insumosBajos
    });
});

// Consultar un insumo por ID
router.get('/:id', (req, res) => {
    const insumo = inventario.find(
        item => item.id === Number(req.params.id)
    );

    if (!insumo) {
        return res.status(404).json({
            mensaje: 'Insumo no encontrado'
        });
    }

    res.json({ data: insumo });
});

// Registrar un insumo
router.post('/', (req, res) => {
    const { nombre, cantidad, unidad, stockMinimo } = req.body;

    if (
        typeof nombre !== 'string' || !nombre.trim() ||
        typeof unidad !== 'string' || !unidad.trim() ||
        typeof cantidad !== 'number' ||
        !Number.isFinite(cantidad) || cantidad < 0 ||
        typeof stockMinimo !== 'number' ||
        !Number.isFinite(stockMinimo) || stockMinimo < 0
    ) {
        return res.status(400).json({
            mensaje: 'Datos del insumo inválidos'
        });
    }

    const nuevoInsumo = {
        id: siguienteId++,
        nombre: nombre.trim(),
        cantidad,
        unidad: unidad.trim(),
        stockMinimo
    };

    inventario.push(nuevoInsumo);

    res.status(201).json({
        mensaje: 'Insumo registrado correctamente',
        data: nuevoInsumo
    });
});

// Actualizar cantidad
router.patch('/:id/cantidad', (req, res) => {
    const cantidad = req.body.cantidad;

    if (
        typeof cantidad !== 'number' ||
        !Number.isFinite(cantidad) ||
        cantidad < 0
    ) {
        return res.status(400).json({
            mensaje: 'La cantidad debe ser un número mayor o igual a cero'
        });
    }

    const insumo = inventario.find(
        item => item.id === Number(req.params.id)
    );

    if (!insumo) {
        return res.status(404).json({
            mensaje: 'Insumo no encontrado'
        });
    }

    insumo.cantidad = cantidad;

    res.json({
        mensaje: 'Cantidad actualizada correctamente',
        data: insumo
    });
});

module.exports = router;
