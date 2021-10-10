import express from 'express';
const helmet = require("helmet");
const routes = require('./routes');

const router = express.Router();
const app = express();
const port = 3001;

app.use(helmet());

app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.use('/api/v1', routes(router));

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`)
});