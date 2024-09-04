// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// In-memory store for uploaded songs (can be replaced with a database)
let songsList = [];

// Middleware
app.use(cors()); // Enable CORS
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

// Handle file upload
app.post('/upload', (req, res) => {
    const albumName = req.body.albumName || 'Unknown Album';
    if (req.files && req.files.song) {
        const song = req.files.song;
        const uploadPath = path.join(__dirname, 'public', 'uploads', song.name);

        // Ensure the uploads directory exists
        const uploadsDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        song.mv(uploadPath, (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).send(err);
            }

            // Store song info
            const songInfo = {
                name: song.name,
                album: albumName,
                filePath: `/uploads/${song.name}`
            };
            songsList.push(songInfo);

            res.send(songInfo);
        });
    } else {
        res.status(400).send('No file uploaded');
    }
});

// Get list of songs
app.get('/songs', (req, res) => {
    res.json(songsList);
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
