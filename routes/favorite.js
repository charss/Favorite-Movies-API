const router = require('express').Router();
const db = require('../db')

router.route('/:id').delete((req, res) => {
  const id = parseInt(req.params.id)

  console.log(id)

  db.query('DELETE FROM user_movie WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    if (results.rowCount == 0) {
      res.status(400).send(`Entry doesn't exist`)
    } else {
      res.status(200).send(`Favorite movie removed with ID: ${id}`)
    }
  })
})

module.exports = router