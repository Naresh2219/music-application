// src/components/SongCard.js
import React from 'react';

const SongCard = ({ songName }) => {
    return (
        <div className="song-card">
            <h3>{songName}</h3>
        </div>
    );
};

export default SongCard;
