const fs = require('fs').promises

const getNotaAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/extras/sys-notas.json', 'utf8')
    const notas = JSON.parse(data)

    return res.status(200).json(notas)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudieron obtener las notas'
    })
  }
}
const postNota = async (req, res) => {
  try {
    const data = await fs.readFile('./data/extras/sys-notas.json', 'utf8')
    const notas = JSON.parse(data)

    const nuevaNota = req.body

    nuevaNota.id = notas.length + 1

    notas.push(nuevaNota)

    await fs.writeFile(
      './data/extras/sys-notas.json',
      JSON.stringify(notas, null, 2)
    )

    return res.status(201).json(nuevaNota)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'No se pudo guardar la nota'
    })
  }
}

module.exports = {
  getNotaAll,
  postNota
}