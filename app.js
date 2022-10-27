const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const testRouter = require("./routes/test");
const userRouter = require("./routes/user");
const movieRouter = require("./routes/movie");
const favoriteRouter = require("./routes/favorite");

app.use('/test', testRouter);
app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/favorites', favoriteRouter);

app.get('/', function(req, res) {
  res.send("This is a test page!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});