const router = require('express').Router();
const db = require('../db')

router.route('/').get((req, res) => {
  db.query('SELECT * FROM movies', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

router.route('/:id').get((req, res) => {
  const id = parseInt(req.params.id)

  db.query('SELECT * FROM movies WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

router.route('/add').post((req, res) => {
  const {title, director, release_date} = req.body

  db.query('INSERT INTO movies (title, director, release_date) VALUES ($1, $2, $3) RETURNING *', [title, director, release_date], (error, results) => {
    if (error) {
      throw error
    }

    res.status(201).send(`Movie added with ID: ${results.rows[0].id}`)
  })
})

router.route('/:id').put((req, res) => {
  const id = parseInt(req.params.id)
  const {title, director, release_date} = req.body

  db.query('UPDATE movies set title = $1, director = $2, release_date = $3 WHERE id = $4', [title, director, release_date, id], (error, results) => {
    if (error) {
      throw error
    }

    res.status(200).send(`Movie modified with ID ${id}`)
  })

})

router.route('/:id').delete((req, res) => {
  const id = parseInt(req.params.id)

  db.query('DELETE FROM movies WHERE id = $1', [id], (error, results) => {
    if (error) {
      return res.status(400).send(`Cannot delete movie. Movie is being referenced`)
    }

    if (results.rowCount == 0) {
      res.status(200).send(`Movie doesn't exist`)
    } else {
      res.status(200).send(`Movie deleted with ID: ${id}`)
    }
  })
})

module.exports = router