import React, { useState, useEffect } from 'react';
import './SongList.css';

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/songs')
            .then((response) => response.json())
            .then((data) => setSongs(data))
            .catch((error) => console.error('Error fetching songs:', error));
    }, []);

    const handlePlay = (song) => {
        if (currentSong && currentSong.name === song.name && isPlaying) {
            setIsPlaying(false);
            audioRef.current.pause();
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
            audioRef.current.src = song.url;
            audioRef.current.play();
        }
    };

    return (
        <div className="song-list">
            <h2>Available Songs</h2>
            <ul>
                {songs.map((song, index) => (
                    <li key={index} className={`song-item ${currentSong && currentSong.name === song.name ? 'playing' : ''}`}>
                        <button onClick={() => handlePlay(song)} className="play-button">
                            {currentSong && currentSong.name === song.name && isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <p>{song.name}</p>
                    </li>
                ))}
            </ul>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

export default SongList;
