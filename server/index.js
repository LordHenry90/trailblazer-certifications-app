const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const trailblazerDataPath = path.join(__dirname, '../src/trailblazerData.json');

// Endpoint per ottenere i dati dei Trailblazers
app.get('/api/trailblazers', (req, res) => {
  fs.readFile(trailblazerDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }
    res.send(JSON.parse(data));
  });
});

// Endpoint per aggiornare i dati dei Trailblazers
app.post('/api/trailblazers', (req, res) => {
  const newTrailblazers = req.body;
  fs.writeFile(trailblazerDataPath, JSON.stringify(newTrailblazers, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error writing data');
    }
    res.send('Data updated successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
