import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validation middleware
const validateSurvey = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
  body('age').optional().isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120').optional(),
  body('favoriteFeature').isIn(['Hands-on activities', 'Creative challenges', 'Team projects', 'Educational fun'])
    .withMessage('Please select a valid favorite feature'),
  body('improvements.*').isIn(['More hands-on activities', 'Longer workshops', 'More creative challenges', 'Other'])
    .withMessage('Please select valid improvements')
];

// Save survey data to a JSON file
app.post('/api/v1/survey', validateSurvey, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }

  const surveyData = { ...req.body, submittedAt: new Date() };
  
  const dir = path.join(process.cwd(), 'surveys');

  try {
    await fs.mkdir(dir, { recursive: true });

    const fileName = `survey_${Date.now()}.json`;
    await fs.writeFile(path.join(dir, fileName), JSON.stringify(surveyData, null, 2));

    res.status(201).json({ message: 'Survey saved successfully', fileName });
  } catch (error) {
    console.error('Error saving survey:', error);
    res.status(500).json({ error: 'Failed to save survey' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});