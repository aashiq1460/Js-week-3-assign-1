import express from 'express';
import api from './api/index.js';

const app = express();

// Read JSON request bodies
app.use(express.json());

// Read URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

// All API routes start with /api/v1
app.use('/api/v1', api);

export default app;