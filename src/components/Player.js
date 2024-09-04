// src/components/Player.js
import React from 'react';

const Player = ({ songUrl }) => {
    return (
        <div>
            {songUrl ? (
                <audio controls>
                    <source src={songUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <p>No song selected</p>
            )}
        </div>
    );
};

export default Player;
