const fs = require('fs').promises;
const path = './data/extras/sys-materias.json';

const getMaterias = async (req, res) => {
  try {
    const data = await fs.readFile(path, 'utf8');
    const materias = JSON.parse(data);
    return res.status(200).json(materias);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al obtener las materias' });
  }
};

const postMateria = async (req, res) => {
  try {
    const { idMateria, nombre, cuatrimestre } = req.body;

    // Validación básica
    if (!idMateria || !nombre || !cuatrimestre) {
      return res.status(400).json({ msg: 'Faltan datos obligatorios (idMateria, nombre, cuatrimestre)' });
    }

    const data = await fs.readFile(path, 'utf8');
    const materias = JSON.parse(data);

    // Evitar duplicados
    if (materias.find((m) => m.idMateria === idMateria)) {
      return res.status(409).json({ msg: `La materia con id ${idMateria} ya existe` });
    }

    const nuevaMateria = { idMateria, nombre, cuatrimestre };
    materias.push(nuevaMateria);

    await fs.writeFile(path, JSON.stringify(materias, null, 2), 'utf8');
    return res.status(201).json(nuevaMateria);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error al guardar la materia' });
  }
};

module.exports = { getMaterias, postMateria };