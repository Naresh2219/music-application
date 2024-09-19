// src/components/AudioPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import './index.css';  // Updated to point to your CSS file

const AudioPlayer = ({ songUrl }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Update progress bar as the song plays
    useEffect(() => {
        const updateProgress = () => {
            if (audioRef.current) {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                setProgress((currentTime / duration) * 100);
            }
        };

        audioRef.current?.addEventListener('timeupdate', updateProgress);

        return () => {
            audioRef.current?.removeEventListener('timeupdate', updateProgress);
        };
    }, []);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleForward = () => {
        audioRef.current.currentTime += 10; // Skip forward 10 seconds
    };

    const handleBackward = () => {
        audioRef.current.currentTime -= 10; // Skip backward 10 seconds
    };

    const handleProgressChange = (e) => {
        const currentTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = currentTime;
        setProgress(e.target.value);
    };

    return (
        <div className="audio-player">
            <div className="audio-controls">
                <button className="audio-button" onClick={handleBackward}>
                    ⏮️
                </button>
                <button className="audio-button play-button" onClick={handlePlayPause}>
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="audio-button" onClick={handleForward}>
                    ⏭️
                </button>
            </div>
            <div className="audio-progress-bar">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="progress-slider"
                />
            </div>
            <audio ref={audioRef} src={songUrl}></audio>
        </div>
    );
};

export default AudioPlayer;
