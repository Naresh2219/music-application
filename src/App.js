// src/App.js
import React, { useState } from 'react';
import Upload from './components/Upload';
import Player from './components/Player';
import SongList from './components/SongList';
import Playlist from './components/Playlist';
import './App.css';

const App = () => {
    const [songUrl, setSongUrl] = useState('');

    const handleUpload = (url) => {
        setSongUrl(url);
    };

    return (
        <div className="App">
            <h1>Music Application</h1>
            <Upload onUpload={handleUpload} />
            <SongList songUrl={songUrl} />
        </div>
    );
};

export default App;
