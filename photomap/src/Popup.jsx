import React, { useEffect } from 'react';
import './Popup.css';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import CommentInput from './CommentInput';
import { CiEdit, CiTrash, CiChat1 } from 'react-icons/ci';
function Popup({
  userId,
  markerInfo,
  setIsMarkerClicked,
  isEditorOpen,
  setIsEditorOpen,
  isLogged,
  curDoc,
  setCurDoc,
  db,
  deleteMarker,
  setIsCommentsOpen,
}) {
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

  const openEditorFromPopup = (e) => {
    e.preventDefault();
    // console.log(curDoc);
    console.log(data.id);
    setCurDoc(doc(db, 'marker', `${data.id}`));
    setIsEditorOpen(true);
  };

  // console.log(userId, data.userId);
  const openCommentInput = () => {
    setIsCommentsOpen(true);
  };
  console.log(curDoc);
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
