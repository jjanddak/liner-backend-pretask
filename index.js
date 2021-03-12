const express = require('express')
const app = express()
const port = 3000
const linerRouter = require('./routes/liner');

app.use('/liner', linerRouter);

app.listen(port, () => {
  console.log(`Server listening at ${port}`)
})