import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Connect to database
connectDB();

// Survey Schema and Model
const surveySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true },
  age: { type: Number, min: 0, max: 120 },
  role: { 
    type: String, 
    required: true,
    enum: ['5-7', '8-10', '11-13', '14+']
  },
  recommend: {
    type: String,
    required: true,
    enum: ['Definitely', 'Maybe', 'Not sure']
  },
  favoriteFeature: { 
    type: String, 
    enum: ['Hands-on activities', 'Creative challenges', 'Team projects', 'Educational fun'], 
    required: true 
  },
  improvements: { 
    type: [String], 
    enum: ['More hands-on activities', 'Longer workshops', 'More creative challenges', 'Other'], 
    required: true 
  },
  submittedAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Survey', surveySchema);

// Validation middleware
const validateSurvey = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be between 0 and 120'),
  body('role')
    .isIn(['5-7', '8-10', '11-13', '14+'])
    .withMessage('Please select a valid age group'),
  body('recommend')
    .isIn(['Definitely', 'Maybe', 'Not sure'])
    .withMessage('Please select a valid recommendation'),
  body('favoriteFeature')
    .isIn(['Hands-on activities', 'Creative challenges', 'Team projects', 'Educational fun'])
    .withMessage('Please select a valid favorite feature'),
  body('improvements')
    .isArray()
    .withMessage('Improvements must be an array')
    .custom((value) => {
      const validOptions = ['More hands-on activities', 'Longer workshops', 'More creative challenges', 'Other'];
      return value.every(item => validOptions.includes(item));
    })
    .withMessage('Please select valid improvements')
];

// Survey API endpoint
app.post('/api/v1/survey', validateSurvey, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const surveyData = new Survey(req.body);
    const savedSurvey = await surveyData.save();

    res.status(201).json({ message: 'Survey saved successfully', survey: savedSurvey });
  } catch (error) {
    console.error('Error saving survey:', error);
    res.status(500).json({ error: 'Failed to save survey' });
  }
});

// Server Listener
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
