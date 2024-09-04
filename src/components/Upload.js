// src/components/Upload.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [albumName, setAlbumName] = useState('');
    const [songsList, setSongsList] = useState([]);

    useEffect(() => {
        // Fetch the list of songs when the component mounts
        const fetchSongs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/songs');
                setSongsList(res.data);
            } catch (err) {
                console.error('Error fetching songs list:', err);
            }
        };

        fetchSongs();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !albumName) return;

        const formData = new FormData();
        formData.append('song', file);
        formData.append('albumName', albumName);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update the list of songs after a successful upload
            setSongsList([...songsList, res.data]);
            setFile(null);
            setAlbumName('');
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Album Name" 
                value={albumName} 
                onChange={(e) => setAlbumName(e.target.value)} 
            />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Song</button>

            <h3>Songs List:</h3>
            <ul>
                {songsList.map((song, index) => (
                    <li key={index}>
                        <strong>{song.name}</strong> - {song.album}
                        <audio controls>
                            <source src={`http://localhost:5000${song.filePath}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Upload;
