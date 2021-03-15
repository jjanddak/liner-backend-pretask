const express = require('express')
const app = express()
const port = 3000
const linerRouter = require('./routes/liner');
const userRouter = require('./routes/user');
app.use(express.json());

app.use('/liner', linerRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})