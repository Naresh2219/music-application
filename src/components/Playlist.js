import React, { useState, useEffect } from 'react';
import Player from './Player';

const Playlist = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  // Fetch the list of songs from your server
  useEffect(() => {
    fetch('/api/songs') // Make sure your endpoint is correct
      .then(response => response.json())
      .then(data => setSongs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Playlist</h2>
      <ul>
        {songs.map(song => (
          <li key={song.filename}>
            <button onClick={() => setSelectedSong(`/uploads/${song.filename}`)}>
              {song.filename}
            </button>
          </li>
        ))}
      </ul>
      {selectedSong && <Player songUrl={selectedSong} />}
    </div>
  );
};

export default Playlist;
