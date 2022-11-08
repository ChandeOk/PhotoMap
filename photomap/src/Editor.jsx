import React, { useState } from 'react';
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { updateDoc, deleteDoc } from 'firebase/firestore';
import './Editor.css';
import { useEffect } from 'react';
import { CiCircleCheck } from 'react-icons/ci';
function Editor({
  setIsEditorOpen,
  storage,
  curDoc,
  setMarkers,
  setIsMarkerClicked,
  isMarkerClicked,
}) {
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState('');
  const [textValue, setTextValue] = useState('Your comment here..');
  const handleChange = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    // console.log(typeof file);

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadTask.then(async (snapshot) => {
    //   const url = await getDownloadURL(snapshot.ref);
    //   setImgUrl(url);
    //   // setStorageUri(snapshot.metadata.fullPath);
    // });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  const handleTextValueChange = (e) => {
    setTextValue(e.target.value);
  };

  const updateMarker = async (imgUrl) => {
    // console.log('UPDATE START');
    // console.log('--------', imgUrl, textValue, curDoc, '----------');
    await updateDoc(curDoc, { imgUrl, textValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('!!!!!!!!!!!!SUBMIT!!!!!!!!!');
    updateMarker(imgUrl);
    setIsEditorOpen(false);
    setIsMarkerClicked(false);
  };

  const handleCloseBtn = async () => {
    if (isMarkerClicked) {
      setIsEditorOpen(false);
      return;
    }
    setIsEditorOpen(false);
    setMarkers((prev) => prev.slice(0, -1));
    await deleteDoc(curDoc);
  };

  // console.log(curDoc);
  return (
    <div className='editor-container'>
      <button className='editor-close-btn' onClick={handleCloseBtn}>
        X
      </button>
      <form action='submit' onSubmit={handleSubmit}>
        <div className='editor-image-container'>
          {progress < 100 ? (
            <label
              htmlFor='editor-image-upload'
              className='editor-image-upload-btn'
            >
              Upload Image
              <input
                type='file'
                name='editor-image-upload'
                id='editor-image-upload'
                accept='image/png, image/jpeg'
                className='editor-image-upload'
                onChange={handleChange}
              />
            </label>
          ) : (
            <img
              src={imgUrl}
              alt='image-preview'
              className='editor-image-preview'
            />
          )}
        </div>
        <textarea
          name='editor-text'
          id='editor-text'
          className='editor-text-area'
          value={textValue}
          onChange={handleTextValueChange}
          maxLength={40}
        ></textarea>
        {progress === 100 && (
          <button type='submit' className='editor-submit'>
            <CiCircleCheck />
          </button>
        )}
        {progress < 100 && progress !== undefined && (
          <h2>Loading: {progress}%</h2>
        )}
      </form>
    </div>
  );
}

export default Editor;
