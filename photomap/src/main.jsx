import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import the functions you need from the SDKs you need
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAyZeP0W5_dLOzr72hxQS0ydT9--WilIFA',

  authDomain: 'photomap-a9c91.firebaseapp.com',

  projectId: 'photomap-a9c91',

  storageBucket: 'photomap-a9c91.appspot.com',

  messagingSenderId: '555596417146',

  appId: '1:555596417146:web:36c99bd11cee29a8f153c3',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const addMarker = async (lat, lng, id, uid) => {
  try {
    const docRef = await setDoc(doc(db, 'marker', id), {
      lat: lat,
      lng: lng,
      id: id,
      userId: uid,
      comments: [],
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const readDB = async () => {
  const querySnapshot = await getDocs(collection(db, 'marker'));
  return querySnapshot.docs.map((map) => map.data());
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App
      addMarker={addMarker}
      readDB={readDB}
      signInWithGoogle={signInWithGoogle}
      auth={auth}
      logout={logout}
      db={db}
      storage={storage}
    />
  </React.StrictMode>
);
