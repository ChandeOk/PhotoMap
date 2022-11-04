import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useState } from 'react';
import { isRouteErrorResponse } from 'react-router-dom';
import './App.css';
import Auth from './Auth';
import Editor from './Editor';
import Login from './Login';
import MyMap from './Map';
import Popup from './Popup';

function App(props) {
  const [markers, setMarkers] = useState([]);
  const [isLogged, setIsLogged] = useState();
  const [userId, setUserId] = useState('');

  const loadMarkersFromDB = async () => {
    const result = await props.readDB();
    setMarkers(result);
  };

  useEffect(() => {
    loadMarkersFromDB();
  }, []);

  useEffect(() => {
    onAuthStateChanged(props.auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLogged(true);
        console.log('Logged');
      } else {
        setIsLogged(false);
        console.log('no user');
      }
    });
  }, []);

  return (
    <div className='App'>
      <Auth />
      <Login
        signInWithGoogle={props.signInWithGoogle}
        auth={props.auth}
        logout={props.logout}
        db={props.db}
        isLogged={isLogged}
      />
      <MyMap
        markers={markers}
        setMarkers={setMarkers}
        addMarker={props.addMarker}
        isLogged={isLogged}
        userId={userId}
        storage={props.storage}
        db={props.db}
      />
      {/* <Popup /> */}
      {/* <Editor /> */}
    </div>
  );
}

export default App;
