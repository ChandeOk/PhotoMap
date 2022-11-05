import React, { useEffect } from 'react';
import './Popup.css';
import { getDoc } from 'firebase/firestore';
import { useState } from 'react';
function Popup({ id, markerInfo, setIsMarkerClicked }) {
  const [data, setData] = useState({});
  const read = async () => {
    const answer = await getDoc(markerInfo);
    console.log(answer.data());
    setData(answer.data());
  };
  console.log(data);
  useEffect(() => {
    read();
  }, []);

  const closePopup = () => {
    setIsMarkerClicked(false);
  };
  return (
    <div className='popup-container'>
      <div className='popup-image-container'>
        <img src={data.imgUrl} alt='Comment image' className='popup-image' />
      </div>
      <p className='popup-text'>{data.textValue}</p>
      <button className='popup-close-btn' onClick={closePopup}>
        X
      </button>
    </div>
  );
}

export default Popup;
