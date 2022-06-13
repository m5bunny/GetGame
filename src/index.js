const dotenv = require("dotenv");
dotenv.config({path: '.env-local'});

const express = require('express');
const userRouter = require('./routers/user')

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/users', userRouter);

app.post('/test', (req, res) =>
{
});


app.listen(port, () =>
{
  console.log(`The server is up on ${port}`);
});