import React, { useState } from 'react';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateDoc } from 'firebase/firestore';
import './Editor.css';
import { useEffect } from 'react';
function Editor({ setIsEditorOpen, storage, curDoc }) {
  const [imgUrl, setImgUrl] = useState('');
  const [textValue, setTextValue] = useState('Your comment here..');
  const handleChange = (e) => {
    const file = e.target?.files[0];
    if (!file) return;
    console.log(typeof file);

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);

    uploadTask.then(async (snapshot) => {
      const url = await getDownloadURL(snapshot.ref);
      setImgUrl(url);
      // setStorageUri(snapshot.metadata.fullPath);
    });
  };

  const handleTextValueChange = (e) => {
    setTextValue(e.target.value);
  };

  const updateMarker = async (imgUrl) => {
    await updateDoc(curDoc, { imgUrl, textValue });
  };
  // useEffect(() => {
  //   console.log(curDoc);
  //   updateMarker(imgUrl);
  // }),
  //   [imgUrl];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('!!!!!!!!!!!!SUBMIT!!!!!!!!!');
    updateMarker(imgUrl);
  };

  // console.log(curDoc);
  return (
    <div className='editor-container'>
      <button
        className='editor-close-btn'
        onClick={() => setIsEditorOpen(false)}
      >
        X
      </button>
      <form action='submit' onSubmit={handleSubmit}>
        <div className='editor-image-container'>
          <label
            htmlFor='editor-image-upload'
            className='editor-image-upload-btn'
          >
            Upload Image
          </label>
          <input
            type='file'
            name='editor-image-upload'
            id='editor-image-upload'
            accept='image/png, image/jpeg'
            className='editor-image-upload'
            onChange={handleChange}
          />
        </div>
        <textarea
          name='editor-text'
          id='editor-text'
          className='editor-text-area'
          value={textValue}
          onChange={handleTextValueChange}
        ></textarea>
        <button type='submit'>OK</button>
      </form>
    </div>
  );
}

export default Editor;
