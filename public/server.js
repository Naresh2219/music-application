const express = require('express');
const fileUpload = require('express-fileupload');  // To handle file uploads
const AWS = require('@aws-sdk/client-s3');         // AWS SDK for S3
const path = require('path');
require('dotenv').config();                        // Load environment variables

const app = express();

// Middleware to handle file uploads
app.use(fileUpload());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize AWS S3 Client
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Route to handle file uploads
app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const songFile = req.files.file;  // Assuming the file input is named 'file'

    const uploadParams = {
        Bucket: 'your-s3-bucket-name',  // Replace with your actual S3 bucket name
        Key: `uploads/${songFile.name}`, // File will be saved in the 'uploads' folder of your S3 bucket
        Body: songFile.data,
        ContentType: songFile.mimetype
    };

    try {
        const data = await s3.putObject(uploadParams);
        res.send({
            message: 'File uploaded successfully',
            data
        });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
    }
});

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
