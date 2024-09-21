import React, { useState, useEffect } from 'react';
import './SongList.css'; // Import the CSS file

const SongList = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/songs')
            .then((response) => response.json())
            .then((data) => setSongs(data))
            .catch((error) => console.error('Error fetching songs:', error));
    }, []);

    return (
        <div className="song-list">
            <h2>Available Songs</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index} className="song-item">
                        <audio controls>
                            <source src={song.url} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                        <p>{song.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SongList;
