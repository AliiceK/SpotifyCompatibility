import './App.css';
import Body from './body';
import Border from './border';
import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [username1, setUsername1] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayName1, setDisplayName1] = useState('');

  const handleLogin = (user) => {
    const userUsername = user === 'userA' ? username : username1;
    localStorage.removeItem(`${userUsername}Token`);
    window.location.href = `http://localhost:3001/login/${userUsername}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');
    const displayName = params.get('displayName');

    if (token && username) {
      localStorage.setItem(`${username}Token`, token);
    }

    if (displayName) {
      if (username === username) {
        setDisplayName(decodeURIComponent(displayName));
      } else if (username === username1) {
        setDisplayName1(decodeURIComponent(displayName));
      }
    }
  }, []);

  return (
    <div className="App">
      <Border />
      <Body />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Spotify Username for User A" />
      <button id="submitbutton" type="submit" onClick={() => handleLogin('userA')}>Login for First User</button>
      {displayName && <p>Welcome, {displayName}</p>}
      <input type="text" value={username1} onChange={(e) => setUsername1(e.target.value)} placeholder="Enter Spotify Username for User B" />
      <button id="submitbutton" type="submit" onClick={() => handleLogin('userB')}>Login for Second User</button>
      {displayName1 && <p>Welcome, {displayName1}</p>}
    </div>
  );
}

export default App;


//The useEffect hook is only triggered when the component mounts or when its dependencies change.
// In your case, the dependencies are not specified, so it only runs on the initial render. 
//This means that it won't respond to subsequent changes in the URL parameters after the initial load

