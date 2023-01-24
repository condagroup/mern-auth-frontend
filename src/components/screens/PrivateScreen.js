import { useEffect, useState } from 'react';
import axios from 'axios';

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState('');
  
  const [privateData, setPrivateData] = useState('');

  const logoutHandler = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      history.push('/login');
    }
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/private',
          config
        );
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem('authToken');
        setError('You are not authorized please login');
      }
    };
    // fetchPrivateData();
  }, [history]);

  let timer;

// this function sets the timer that logs out the user after 10 secs
const handleLogoutTimer = () => {
  timer = setTimeout(() => {
    // clears any pending timer.
    resetTimer();
    // Listener clean up. Removes the existing event listener from the window
    Object.values(events).forEach((item) => {
      window.removeEventListener(item, resetTimer);
    });
    // logs out user
    logoutHandler();
  }, 10000); // 10000ms = 10secs. You can change the time.
};

const resetTimer = () => {
  if (timer) clearTimeout(timer);
};

useEffect(() => {
  Object.values(events).forEach((item) => {
    window.addEventListener(item, () => {
      resetTimer();
      handleLogoutTimer();
    });
  });
}, []);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div style={{ background: 'black', color: 'white' }}>{privateData}</div>
      <button onClick={logoutHandler}>Logout</button>
    </>
  );
};

export default PrivateScreen;
