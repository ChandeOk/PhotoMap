import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import Auth from './Auth';
import Comments from './Comments';
import Login from './Login';
import MyMap from './Map';

function App(props) {
  const [markers, setMarkers] = useState([]);
  const [isLogged, setIsLogged] = useState();
  const [userId, setUserId] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [curMarkerDoc, setCurMarkerDoc] = useState();
  const [userName, setUserName] = useState();
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
      } else {
        setIsLogged(false);
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
        setUserName={setUserName}
      />
      <div className='main'>
        <MyMap
          markers={markers}
          setMarkers={setMarkers}
          addMarker={props.addMarker}
          isLogged={isLogged}
          userId={userId}
          storage={props.storage}
          db={props.db}
          setIsCommentsOpen={setIsCommentsOpen}
          setCurMarkerDoc={setCurMarkerDoc}
        />
        {isCommentsOpen && (
          <Comments
            curMarkerDoc={curMarkerDoc}
            db={props.db}
            userId={userId}
            isLogged={isLogged}
            userName={userName}
          />
        )}
      </div>
      {/* <Popup /> */}
      {/* <Editor /> */}
    </div>
  );
}

export default App;
