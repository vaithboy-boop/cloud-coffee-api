const express = require('express');
const router = express.Router();

const {
    listarNotificaciones
} = require('../services/notificaciones');

// GET /api/notificaciones
router.get('/', (req, res) => {
    res.json({
        mensaje: 'Lista de notificaciones',
        data: listarNotificaciones()
    });
});

module.exports = router;