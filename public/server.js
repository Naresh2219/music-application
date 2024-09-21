
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // AWS SDK v3
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 5000;

// Configure S3 Client with v3 SDK
const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Upload file to S3
app.post('/upload', async (req, res) => {
    const albumName = req.body.albumName || 'Unknown Album';

    if (req.files && req.files.song) {
        const song = req.files.song;

        const uploadParams = {
            Bucket: 'music-streming', // Replace with your S3 bucket name
            Key: song.name, // File name
            Body: song.data, // File content
            ContentType: song.mimetype, // MIME type
        };

        try {
            // Upload the file using the PutObjectCommand from SDK v3
            const data = await s3.send(new PutObjectCommand(uploadParams));
            res.json({
                fileName: song.name,
                fileUrl: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`,
                album: albumName,
            });
        } catch (err) {
            console.error('Error uploading file:', err);
            res.status(500).send('Failed to upload file');
        }
    } else {
        res.status(400).send('No file uploaded');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
