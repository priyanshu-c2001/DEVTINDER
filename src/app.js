const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

const { connectDB } = require("./config/database");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/requests');
const userRouter = require('./routes/user');

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS']
}));


app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestsRouter);
app.use('/', userRouter);

connectDB().then(() => {
  console.log("Database connection established...");
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch((error) => {
  console.error("Database cannot be connected!!");
  console.error(error);
});

