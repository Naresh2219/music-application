import React, { useState } from 'react';

const Upload = () => {
    const [file, setFile] = useState(null);

    // Function to handle file change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // Function to convert the file to base64 and upload
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        // Convert file to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];  // Get the base64 part

            // Call the upload function
            uploadSong(base64String, file.name);
        };
    };

    // Your uploadSong function
    const uploadSong = async (songData, fileName) => {
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    songData: songData,  // base64-encoded string of song data
                    fileName: fileName,  // e.g., "my-song.mp3"
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error("Error uploading song:", err);
        }
    };

    return (
        <div>
            <h2>Upload a Song</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default Upload;
