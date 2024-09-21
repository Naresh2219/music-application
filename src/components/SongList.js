import React, { useState, useEffect } from 'react';

const SongList = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/songs')
            .then((response) => response.json())
            .then((data) => setSongs(data))
            .catch((error) => console.error('Error fetching songs:', error));
    }, []);

    return (
        <div>
            <h2>Available Songs</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <audio controls>
                            <source src={'https://music-streming.s3.amazonaws.com/public/uploads/music-streming-song.mp3'} type="audio/mp3" />
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
