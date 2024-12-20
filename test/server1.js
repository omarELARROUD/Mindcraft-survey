import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/save', async (req, res) => {
  const data = req.body;

  try {
    await fs.appendFile(path.join(process.cwd(), 'data.json'), JSON.stringify(data, null, 2));
    res.status(201).send('Data saved successfully!');
  } catch (error) {
    res.status(500).send('Error saving data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
