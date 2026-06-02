const { Router } = require('express');
const { getMaterias, postMateria } = require('../../controllers/materia.controller');

const rutas = Router();

rutas.get('/', getMaterias);
rutas.post('/', postMateria);

module.exports = rutas;