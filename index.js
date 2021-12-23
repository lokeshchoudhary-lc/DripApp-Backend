const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./utils/corsConfig');
const helmetConfig = require('./utils/helmetConfig');

require('dotenv').config();
require('./utils/init_mongodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
helmetConfig.config(app);
app.use(cors(corsOptions));

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

const { authVerification } = require('./utils/jwt_helper');

const DropRouteHandler = require('./routes/drop_product_routes');
const AuthRouteHandler = require('./routes/google_auth_routes');

app.use('/api/v1/drop', authVerification, DropRouteHandler);

app.use('/api/v1/auth', AuthRouteHandler);

app.use(async (req, res, next) => {
  const Error = createError.NotFound();
  next(Error);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running at ${PORT} 🚀`));
