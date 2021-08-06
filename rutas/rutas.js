const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./vehiculo'));
app.use(require('./arreglo'));
app.use(require('./taller'));

module.exports = app;