const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());


const trailblazerDataPath = path.join(__dirname, '../src/trailblazerData.json');

// API endpoint per ottenere i dati dei Trailblazers
app.get('/api/trailblazers', (req, res) => {
  fs.readFile(trailblazerDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }
    res.send(JSON.parse(data));
  });
});

// API endpoint per aggiornare i dati dei Trailblazers
app.post('/api/trailblazers', (req, res) => {
  const newTrailblazers = req.body;
  fs.writeFile(trailblazerDataPath, JSON.stringify(newTrailblazers, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing data');
    }
    res.send('Data updated successfully');
  });
});

// Endpoint per ottenere le certificazioni da un servizio esterno
app.get('/api/trailblazer/:id/certifications', async (req, res) => {
  const userId = req.params.id;
  const apiUrl = `https://go-trailhead-leaderboard-api.up.railway.app/trailblazer/${userId}/certifications`;
  try {
    const response = await axios.get(apiUrl);
    res.send(response.data);
  } catch (error) {
    console.error(`Error fetching certifications for ${userId}:`, error);
    res.status(500).send('Error fetching certifications');
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
