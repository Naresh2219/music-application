const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/music-streaming', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define Song Schema and Model
const songSchema = new mongoose.Schema({
  name: String,
  album: String,
  filePath: String
});

const Song = mongoose.model('Song', songSchema);

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

// Handle file upload and store metadata in MongoDB
app.post('/upload', async (req, res) => {
  const albumName = req.body.albumName || 'Unknown Album';

  if (req.files && req.files.song) {
    const song = req.files.song;
    const uploadPath = path.join(__dirname, 'public', 'uploads', song.name);

    // Ensure the uploads directory exists
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    song.mv(uploadPath, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).send(err);
      }

      // Store song metadata in MongoDB
      const songInfo = new Song({
        name: song.name,
        album: albumName,
        filePath: `/uploads/${song.name}`
      });

      try {
        await songInfo.save();
        res.send(songInfo);
      } catch (error) {
        console.error('Error saving song metadata to database:', error);
        res.status(500).send('Error saving song metadata to database');
      }
    });
  } else {
    res.status(400).send('No file uploaded');
  }
});

// Get list of songs from MongoDB
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs from database:', error);
    res.status(500).send('Error fetching songs from database');
  }
});

// Serve uploaded songs
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
