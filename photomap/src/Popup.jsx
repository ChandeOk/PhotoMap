import React, { useEffect } from 'react';
import './Popup.css';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { CiEdit, CiTrash, CiChat1 } from 'react-icons/ci';
function Popup({
  userId,
  markerInfo,
  setIsMarkerClicked,
  setIsEditorOpen,
  isLogged,
  setCurDoc,
  db,
  deleteMarker,
  setIsCommentsOpen,
}) {
  const [data, setData] = useState({});
  const read = async () => {
    const answer = await getDoc(markerInfo);
    setData(answer.data());
  };
  useEffect(() => {
    read();
  }, []);

  const closePopup = () => {
    setIsMarkerClicked(false);
  };

  const openEditorFromPopup = (e) => {
    e.preventDefault();
    setCurDoc(doc(db, 'marker', `${data.id}`));
    setIsEditorOpen(true);
  };

  const openCommentInput = () => {
    setIsCommentsOpen(true);
  };
  return (
    <div className='popup-container'>
      <div className='popup-image-container'>
        <img src={data?.imgUrl} alt='Comment image' className='popup-image' />
      </div>
      <p className='popup-text'>{data?.textValue}</p>
      <button className='popup-close-btn' onClick={closePopup}>
        <p className='popup-close-x'>x</p>
      </button>
      <div className='popup-btn-container'>
        {data.userId === userId && isLogged && (
          <button className='popup-open-editor' onClick={openEditorFromPopup}>
            <CiEdit />
          </button>
        )}
        {data.userId === userId && isLogged && (
          <button className='popup-remove-marker' onClick={deleteMarker}>
            <CiTrash />
          </button>
        )}
        <button className='popup-add-comment' onClick={openCommentInput}>
          <CiChat1 />
        </button>
      </div>
    </div>
  );
}

export default Popup;
