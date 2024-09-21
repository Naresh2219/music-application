const express = require('express');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(cors({
    origin:'*',
    methods:['GET', 'POST', 'OPTIONS'],
}))
app.use(express.json({ limit: '10mb' })); // Set limit for JSON requests
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Set limit for URL-encoded data

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Upload a song to S3
app.post('/upload', async (req, res) => {
    const { songData, fileName } = req.body;

    // Validate incoming data
    if (!songData || !fileName) {
        return res.status(400).json({ error: 'songData and fileName are required' });
    }

    try {
        const buffer = Buffer.from(songData, 'base64');  // Ensure this is a valid base64 string
        const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            Key: `public/uploads/${fileName}`,  // Upload to 'public/uploads' folder
            Body: buffer,
            ContentType: 'audio/mp3',
            ACL:'public-read'
        };

        const command = new PutObjectCommand(uploadParams);
        const response = await s3.send(command);

        console.log('Upload Success:', response);
        res.json({ message: 'File uploaded successfully' });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
    }
});

// List all uploaded songs
app.get('/songs', async (req, res) => {
    const listParams = {
        Bucket: process.env.S3_BUCKET,
        Prefix: 'public/uploads/'  // Folder where songs are uploaded
    };

    try {
        const command = new ListObjectsV2Command(listParams);
        const data = await s3.send(command);
        const songs = data.Contents.map(item => {
            return {
                name: item.Key.split('/').pop(),  // Extract file name
                url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`  // Construct the file URL
            };
        });
        res.json(songs);
    } catch (err) {
        console.error('Error listing songs:', err);
        res.status(500).send('Error listing songs');
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
