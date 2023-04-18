import cors from 'cors';
import express from 'express';

const app = express();
const port = process.env.PORT || 5656;

app.use(cors());

app.get('/api/hello', (req, res) => {
  console.log('got request');
  res.send({ message: 'Hello from the server!' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});