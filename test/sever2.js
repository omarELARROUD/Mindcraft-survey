import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Define the path to the JSON file
const filePath = path.join(process.cwd(), 'data.json');

app.post('/save', async (req, res) => {
  const newData = req.body;

  try {
    // Ensure the file exists or create an empty JSON array if it doesn't
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([]));
    }

    // Read the existing data
    const fileContents = await fs.readFile(filePath);
    const jsonData = JSON.parse(fileContents);

    // Append the new data
    if (Array.isArray(jsonData)) {
      jsonData.push(newData); // Add to the array
    } else {
      throw new Error('Invalid JSON structure in the file. Expected an array.');
    }

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    res.status(201).send('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(500).send('Error saving data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
