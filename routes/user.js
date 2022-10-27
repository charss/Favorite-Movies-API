const router = require('express').Router();
const db = require('../db')

router.route('/').get((req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

router.route('/:id').get((req, res) => {
  const id = parseInt(req.params.id)

  db.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

router.route('/add').post((req, res) => {
  const {username, password} = req.body

  db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
    if (error) {
      throw error
    }

    res.status(201).send(`User added with ID: ${results.rows[0].id}`)
  })
})

router.route('/:id').delete((req, res) => {
  const id = parseInt(req.params.id)

  db.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }

    if (results.rowCount == 0) {
      res.status(200).send(`User doesn't exist`)
    } else {
      res.status(200).send(`User deleted with ID: ${id}`)
    }
  })
})

router.route('/:id/favorites').post((req, res) => {
  const id = parseInt(req.params.id)
  const movie_title = req.body.title

  db.query('SELECT * FROM movies WHERE title = $1', [movie_title], (error, movie_res) => {
    if (error) {
      throw error
    }

    if (movie_res.rowCount == 0) {
      res.status(200).send("Movie doesn't exist")
      return
    }

    const movie_id = parseInt(movie_res.rows[0]['id'])
    const movie_title = movie_res.rows[0]['title']
    console.log(movie_id, movie_title);

    db.query('INSERT INTO user_movie (user_id, movie_id) VALUES ($1, $2)', [id, movie_id], (error1, results) => {
      if (error1) {
        return res.status(400).send(`Favorite movie already exist for that user`)
      }
  
      res.status(201).send(`Added "${movie_title}" as favorite movie for User ${id}`)
    })
  })
})

router.route('/:id/favorites').get((req, res) => {
  const id = parseInt(req.params.id)

  db.query(`
    SELECT user_movie.id, movies.title, movies.director, movies.release_date 
    FROM user_movie 
    JOIN users ON user_movie.user_id=users.id 
    JOIN movies ON user_movie.movie_id=movies.id 
    WHERE user_id=$1 
  `, [id], (error, results) => {
    if (error) {
      throw error
    }

    res.status(200).json(results.rows)
  })
})

module.exports = router