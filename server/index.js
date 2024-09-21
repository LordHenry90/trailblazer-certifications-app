const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const trailblazerDataPath = path.join(__dirname, '../src/trailblazerData.json');

// Funzione per salvare il file JSON
const saveToJSON = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(trailblazerDataPath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// API endpoint per ottenere i dati dei Trailblazers
app.get('/api/trailblazers', (req, res) => {
  fs.readFile(trailblazerDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }
    res.send(JSON.parse(data));
  });
});

// Rotta POST per aggiungere un nuovo Trailblazer
app.post('/api/trailblazers', (req, res) => {
  const newTrailblazer = req.body;

  // Leggi il file JSON esistente
  fs.readFile(trailblazerDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading trailblazer data' });
    }

    const trailblazers = JSON.parse(data);

    // Verifica se il trailblazer esiste già (ad esempio tramite id o URL)
    const exists = trailblazers.find(tb => tb.id === newTrailblazer.id);
    if (exists) {
      return res.status(400).json({ message: 'Trailblazer already exists' });
    }

    // Aggiungi il nuovo Trailblazer all'array
    trailblazers.push(newTrailblazer);

    // Scrivi l'aggiornamento nel file JSON
    fs.writeFile(trailblazerDataPath, JSON.stringify(trailblazers, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving trailblazer data' });
      }

      res.status(201).json({ message: 'Trailblazer added successfully' });
    });
  });
});

// Rotta POST per aggiungere più Trailblazers tramite CSV
app.post('/api/trailblazers/more', (req, res) => {
  const newTrailblazers = req.body;

  // Leggi il file JSON esistente
  fs.readFile(trailblazerDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading trailblazer data' });
    }

    const trailblazers = JSON.parse(data);

    // Filtra i nuovi trailblazers per evitare duplicati
    const filteredNewTrailblazers = newTrailblazers.filter(newTrailblazer => {
      return !trailblazers.some(tb => tb.id === newTrailblazer.id);
    });

    if (filteredNewTrailblazers.length === 0) {
      return res.status(400).json({ message: 'No new Trailblazers to add' });
    }

    // Aggiungi i nuovi Trailblazers non duplicati all'array
    trailblazers.push(...filteredNewTrailblazers);

    // Scrivi l'aggiornamento nel file JSON
    fs.writeFile(trailblazerDataPath, JSON.stringify(trailblazers, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving trailblazer data' });
      }

      res.status(201).json({ message: 'Trailblazers added successfully' });
    });
  });
});

// Rotta per ottenere le certificazioni di un Trailblazer
app.get('/api/trailblazer/:id/certifications', async (req, res) => {
  const trailblazerId = req.params.id;

  // Leggi il file JSON
  fs.readFile(trailblazerDataPath, 'utf8', async (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading trailblazer data' });
    }

    const trailblazers = JSON.parse(data);
    const trailblazer = trailblazers.find(tb => tb.id === trailblazerId);

    // Se il Trailblazer non esiste, restituisci un errore
    if (!trailblazer) {
      return res.status(404).json({ message: 'Trailblazer not found' });
    }

    // Controlla se il Trailblazer ha già certificazioni salvate nel JSON
    if (trailblazer.certifications && trailblazer.certifications.length > 0) {
      console.log('Certifications found in JSON');
      return res.json(trailblazer.certifications); // Restituisci le certificazioni dal file JSON
    } else {
      try {
        // Se le certificazioni non sono nel JSON, chiama l'API esterna
        const externalApiUrl = `https://go-trailhead-leaderboard-api.up.railway.app/trailblazer/${trailblazerId}/certifications`;
        const externalResponse = await axios.get(externalApiUrl);

        if (externalResponse.data && Array.isArray(externalResponse.data.certificationsList)) {
          const certifications = externalResponse.data.certificationsList;

          // Aggiorna il file JSON con le nuove certificazioni
          trailblazer.certifications = certifications;

          // Salva l'aggiornamento nel file JSON
          await saveToJSON(trailblazers);

          console.log('Certifications fetched from external API and saved to JSON');
          return res.json(certifications); // Restituisci le nuove certificazioni
        } else {
          return res.status(500).json({ message: 'Invalid response from external API' });
        }
      } catch (apiError) {
        console.error('Error calling external API:', apiError);
        return res.status(500).json({ message: 'Error fetching certifications from external API' });
      }
    }
  });
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
