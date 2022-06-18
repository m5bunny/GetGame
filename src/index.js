const dotenv = require("dotenv");
dotenv.config({path: '.env-local'});

const express = require('express');
const userRouter = require('./routers/user');
const gameRouter = require('./routers/game');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/games', gameRouter);

const DicItem = require('./models/dicItem')

app.get('/test', async (req, res) => {
  const item = new DicItem();
  res.send(item.test());
});

app.listen(port, () =>
{
  console.log(`The server is up on ${port}`);
});