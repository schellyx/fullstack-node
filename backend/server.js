const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

// File path for storing notes
const notesFilePath = path.join(__dirname, 'nodes-data.json'); // Updated file name

// Helper function to read notes from file
const readNotesFromFile = () => {
  try {
    const data = fs.readFileSync(notesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File does not exist, return an empty array
      return [];
    }
    throw error;
  }
};

// Helper function to write notes to file
const writeNotesToFile = (notes) => {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
};

// Initialize notes and nextId
let notes = readNotesFromFile();
let nextId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1;

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- API Endpoints ---

// GET all notes
app.get('/api/notes', (req, res) => {
  console.log('GET /api/notes');
  res.json(notes);
});

// POST a new note
app.post('/api/notes', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Note text is required' });
  }
  const newNote = { id: nextId++, text };
  notes.push(newNote);
  writeNotesToFile(notes); // Save to file
  console.log('POST /api/notes - Added:', newNote);
  res.status(201).json(newNote);
});

// DELETE a note by id
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);
  if (notes.length < initialLength) {
    writeNotesToFile(notes); // Save to file
    console.log(`DELETE /api/notes/${id} - Deleted`);
    res.status(204).send(); // No Content
  } else {
    console.log(`DELETE /api/notes/${id} - Not Found`);
    res.status(404).json({ error: 'Note not found' });
  }
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});