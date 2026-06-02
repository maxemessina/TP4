const { Router } = require('express')
const {
  getNotaAll,
  postNota
} = require('../../controllers/nota.controller')

const rutas = Router()

rutas.get('/', getNotaAll)
rutas.post('/', postNota)

module.exports = rutas