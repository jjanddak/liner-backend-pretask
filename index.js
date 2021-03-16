const express = require('express')
const app = express()
const port = 3000
const linerRouter = require('./routes/liner');
const userRouter = require('./routes/user');
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use('/liner', linerRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})