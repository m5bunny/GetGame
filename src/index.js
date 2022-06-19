const dotenv = require("dotenv");
dotenv.config({path: '.env-local'});

const express = require('express');
const userRouter = require('./routers/user');
const gameRouter = require('./routers/game');
const discountRouter = require('./routers/discount');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/users', userRouter);
app.use('/games', gameRouter);
app.use('/discounts', discountRouter);

app.listen(port, () =>
{
  console.log(`The server is up on ${port}`);
});