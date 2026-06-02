const { Router } = require('express')
const {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  getAlumnoBySearch,
  deleteAlumno,
  putAlumno
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/search', getAlumnoBySearch)
rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)
rutas.post('/', postAlumno)
rutas.delete('/:legajo', deleteAlumno)
rutas.put('/:legajo', putAlumno)

module.exports = rutas
