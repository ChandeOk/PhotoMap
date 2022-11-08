import React from 'react';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { CiCircleQuestion } from 'react-icons/ci';
import './Login.css';
function Login({ signInWithGoogle, auth, logout, db, isLogged, setUserName }) {
  const [name, setName] = useState('');
  const [user, loading, error] = useAuthState(auth);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setUserName(data.name);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchUserName();
  }, [user, loading]);

  return (
    <div className='login-container'>
      {!isLogged && (
        <button className='google-login-btn' onClick={signInWithGoogle}>
          Login
        </button>
      )}
      <h1 className='logo'>PhotoMap</h1>
      <div className='login-user-info-container'>
        {isLogged && (
          <div className='login-user-info'>
            <h2 className='login-h2'>Logged in as</h2>
            <div className='login-user-name'>{name}</div>
          </div>
        )}
        {/* <div>{user?.email}</div> */}
        {isLogged && (
          <button className='google-logout-btn' onClick={logout}>
            Logout
          </button>
        )}
      </div>
      <a
        className='login-help'
        href='https://github.com/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <CiCircleQuestion />
      </a>
    </div>
  );
}

export default Login;
