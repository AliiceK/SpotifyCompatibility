import './App.css';
import Body from './body';
import Border from './border';
import {useState, useEffect, useCallback} from 'react';

const App = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [username1, setUsername1] = useState(localStorage.getItem('username1') || '');
  const [displayName, setDisplayName] = useState('');
  const [displayName1, setDisplayName1] = useState('');

  const handleLogin = useCallback((user) => {
    const userUsername = user === 'userA' ? username : username1;
    if (user === 'userB') {
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      const url = 'https://www.spotify.com/logout/'
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')
      setTimeout(() => spotifyLogoutWindow.close(), 2000)
      setTimeout(() => {
        window.location.href = `http://localhost:3001/login/${userUsername}`;
      }, 2000);
    } else {
      window.location.href = `http://localhost:3001/login/${userUsername}`;
    }
  }, [username, username1]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem('username1', username1);
  }, [username1]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const displayName = params.get('displayName');

    if (token && username) {
      localStorage.setItem(`${username}Token`, token);
    }
    if (token && username1) {
      localStorage.setItem(`${username1}Token`, token);
    }
    if (displayName) {
      if (displayName === username) {
        setDisplayName(decodeURIComponent(displayName));
      } else if (displayName === username1) {
        setDisplayName1(decodeURIComponent(displayName));
      }
    }
  }, [username, username1]);

  const onInputChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onInputChange_1 = useCallback((event) => {
    setUsername1(event.target.value);
  }, []);

  const onButtonClick = useCallback((event) => {
    handleLogin('userA');
  }, [handleLogin]);

  const onButtonClick_1 = useCallback((event) => {
    handleLogin('userB');
  }, [handleLogin]);

  return (
      <div className="App">
        <Border />
        <Body />
        <input type="text" value={username} placeholder="Enter Spotify Username for User A" onChange={onInputChange}/>
        <button id="submitbutton" type="submit" onClick={onButtonClick}>Login for First User</button>
        {displayName && <p>Welcome, {displayName}</p>}
        <input type="text" value={username1} placeholder="Enter Spotify Username for User B"
               onChange={onInputChange_1}/>
        <button id="submitbutton" type="submit" onClick={onButtonClick_1}>Login for Second User</button>
        {displayName1 && <p>Welcome, {displayName1}</p>}
      </div>
  );
}

export default App;
