import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Parser } from 'json2csv';
import TrailblazerTable from './components/TrailblazerTable';
import ActionMenu from './components/ActionMenu';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  const [trailblazers, setTrailblazers] = useState([]);
  const [filteredTrailblazers, setFilteredTrailblazers] = useState([]);

  useEffect(() => {
    const fetchTrailblazers  = async () => {
      try {
        const response = await axios.get('/api/trailblazers');
        setTrailblazers(response.data);
        setFilteredTrailblazers(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchTrailblazers();
  }, []);


  const handleExportCSV = () => {
    try {
      // Campi che vogliamo includere nel CSV
      const fields = ['id', 'firstName', 'lastName', 'profileUrl'];
      const json2csvParser = new Parser({ fields });
  
      // Converte i dati in formato CSV
      const csv = json2csvParser.parse(trailblazers);
  
      // Crea un blob dal CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'trailblazers.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV');
    }
  };

  const handleAddNew = async (values) => {
    try {
      const response = await axios.post('/api/trailblazers', values);
  
      alert(response.data.message);
  
      // Aggiorna lo stato locale
      setTrailblazers((prevTrailblazers) => [...prevTrailblazers, values]);
      setFilteredTrailblazers((prevTrailblazers) => [...prevTrailblazers, values]);
    } catch (error) {
      console.error('Error adding new trailblazer:', error);
      alert('Error adding new trailblazer');
    }
  };

  const handleAddMore = async (dataFromCSV) => {
    try {
      const response = await axios.post('/api/trailblazers/more', dataFromCSV);
  
      alert(response.data.message);
  
      // Aggiorna lo stato locale
      setTrailblazers((prevTrailblazers) => [...prevTrailblazers, ...dataFromCSV]);
      setFilteredTrailblazers((prevTrailblazers) => [...prevTrailblazers, ...dataFromCSV]);
    } catch (error) {
      console.error('Error adding trailblazers from CSV:', error);
      alert('Error adding trailblazers from CSV');
    }
  };

  // Funzione per gestire il cambiamento nella ricerca
  const handleSearch = (value) => {
    const filtered = trailblazers.filter((tb) =>
      `${tb.firstName} ${tb.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrailblazers(filtered);
  };

  return (
    <div className="App slds-p-around_medium">
      {/* Action Menu */}
      <ActionMenu
        onAddNew={handleAddNew}
        onAddMore={handleAddMore}
        onExportCSV={handleExportCSV}
        onSearch={handleSearch}
      />
      {/* Tabella dei Trailblazers */}
      <TrailblazerTable trailblazers={filteredTrailblazers} />
	    <Footer />
    </div>
  );
};

export default App;
