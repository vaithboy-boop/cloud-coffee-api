const express = require('express');
const inventarioRoutes = require('./routes/inventario');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'Bienvenido a Cloud Coffee API' });
});

app.use('/api/inventario', inventarioRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}

module.exports = app;
