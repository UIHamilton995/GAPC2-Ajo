import express from 'express';
import{ db } from './config'
import dev from './config/dev';

const app = express();
const port = 3000;

dotenv.config();
app.use(logger(dev))
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

db.sync({})
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err: HttpError) => {
    console.log(err);
  });