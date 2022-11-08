import React from 'react';
import { useState } from 'react';
import { updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { CiPaperplane } from 'react-icons/ci';
import './CommentInput.css';
function CommentInput({
  commentsData,
  curMarkerDoc,
  setIsCommentSubmited,
  userId,
}) {
  const [value, setValue] = useState('');
  console.log(commentsData);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  console.log(value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(curMarkerDoc, {
      comments: arrayUnion({ value, userId }),
    });
    setIsCommentSubmited(true);
    console.log('sub');
  };

  return (
    <form action='submit' className='comment-input'>
      <textarea
        name='comment-input'
        id='comment-input'
        className='comment-input-text'
        value={value}
        onChange={handleChange}
        maxLength={100}
      ></textarea>
      <button
        type='submit'
        className='comment-submit-btn'
        onClick={handleSubmit}
      >
        <CiPaperplane />
      </button>
      {/* <input type='text' value={value} onChange={handleChange} /> */}
    </form>
  );
}

export default CommentInput;
