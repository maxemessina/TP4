const fs = require('fs').promises
const path = require('path')
// destructuring para obtener la clase
const { AlumnoModel } = require('../models/alumno.model')

// ruta absoluta del archivo de datos para compatibilidad en diferentes entornos
const dataPath = path.join(__dirname, '../data/alumnos.json')

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    return res.status(200).json(alumnos)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudo obtener el datalle del alumno con legajo n° ${legajo}`
    })
  }
}

const getAlumnoById = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params

    const legajoId = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo)
    )

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(legajoId)
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: 'No se pudo obtener el datalle del alumno con legajo n° {legajo}'
    })
  }
}

// POST alumnos
const postAlumno = async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    const alumnos = JSON.parse(data)

    const { nombre, apellido, email, legajo, isActive } = req.body

    if (!nombre || !apellido || !email || !legajo) {
      return res.status(400).json({
        error: 'Los campos legajo, nombre, apellido y email son obligatorios'
      })
    }

    // verificar si el legajo ya existe
    const legajoExiste = alumnos.find(
      (a) => Number(a.legajo) === Number(legajo)
    )
    if (legajoExiste) {
      return res
        .status(409)
        .json({ error: `Ya existe un alumno con el legajo ${legajo}` })
    }

    const fechaActual = new Date().toISOString().split('T')[0]

    const nuevoAlumnoInstancia = new AlumnoModel(
      nombre,
      apellido,
      email,
      legajo,
      fechaActual, // fechaAlta
      fechaActual, // modificacion
      isActive !== undefined ? isActive : true // por defecto true si no viene en el body
    )

    // obtiene correctamente los atributos protegidos de la clase
    const nuevoAlumno = nuevoAlumnoInstancia.getAllAttributes()

    alumnos.push(nuevoAlumno)
    await fs.writeFile(dataPath, JSON.stringify(alumnos, null, 2))

    console.log(`[POST] Alumno registrado de forma exitosa. Legajo: ${legajo}`)

    return res.status(201).json({
      message: 'Alumno registrado correctamente',
      alumno: nuevoAlumno
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudo crear el alumno' })
  }
}

// GET alumno por apellido o isActive
const getAlumnoBySearch = async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    let alumnos = JSON.parse(data)

    const { apellido, isActive } = req.query

    if (apellido) {
      alumnos = alumnos.filter((a) =>
        a.apellido.toLowerCase().includes(apellido.toLowerCase())
      )
    }

    if (isActive !== undefined) {
      const activo = isActive === 'true'
      alumnos = alumnos.filter((a) => a.isActive === activo)
    }

    console.log(
      `[GET] Buscador ejecutado. Coincidencias devueltas: ${alumnos.length}`
    )

    return res.status(200).json(alumnos)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'No se pudieron obtener los alumnos' })
  }
}
//Put alumno

const putAlumno = async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params
    const { nombre, apellido, email, isActive } = req.body

    // busca alumno
    const indexAlumno = alumnos.findIndex(
      (a) => Number(a.legajo) === Number(legajo)
    )

    //error: no existe
    if (indexAlumno === -1) {
      return res.status(400).json({
        error: `No existe un alumno con el legajo ${legajo}`
      })
    }

    //error: no permite cambiar legajo
    if (req.body.legajo && Number(req.body.legajo) !== Number(legajo)) {
      return res.status(409).json({
        error: 'No se permite modificar el legajo'
      })
    }

    // actualiza la fecha modificación
    const fechaActual = new Date().toISOString().split('T')[0]

    const alumnoActualizado = new AlumnoModel(
      nombre || alumnos[indexAlumno].nombre,
      apellido || alumnos[indexAlumno].apellido,
      email || alumnos[indexAlumno].email,
      Number(legajo),
      alumnos[indexAlumno].fechaAlta,
      fechaActual,
      isActive !== undefined ? isActive : alumnos[indexAlumno].isActive
    )

    alumnos[indexAlumno] = alumnoActualizado.getAllAttributes()

    await fs.writeFile(dataPath, JSON.stringify(alumnos, null, 2))

    console.log(`[PUT] Alumno actualizado correctamente. Legajo: ${legajo}`)

    // 201
    return res.status(201).json({
      message: 'Alumno actualizado correctamente',
      alumno: alumnos[indexAlumno]
    })
  } catch (error) {
    console.log(error)

    // error: 500
    return res.status(500).json({
      error: 'No se pudo actualizar el alumno'
    })
  }
}

// DELETE alumno por numero de legajo
const deleteAlumno = async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params

    const alumnoIndex = alumnos.findIndex(
      (a) => Number(a.legajo) === Number(legajo)
    )

    if (alumnoIndex === -1) {
      return res.status(404).json({
        error: `No existe un alumno con el legajo ${legajo}`
      })
    }

    const alumnoEliminado = alumnos[alumnoIndex]

    alumnos.splice(alumnoIndex, 1)

    await fs.writeFile(dataPath, JSON.stringify(alumnos, null, 2))

    console.log(`[DELETE] Alumno eliminado. Legajo: ${legajo}`)

    return res.status(200).json({
      message: 'Alumno eliminado correctamente',
      alumno: alumnoEliminado
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo eliminar el alumno'
    })
  }
}

module.exports = {
  getAlumnoAll,
  getAlumnoById,
  postAlumno,
  getAlumnoBySearch,
  deleteAlumno,
  putAlumno
}
