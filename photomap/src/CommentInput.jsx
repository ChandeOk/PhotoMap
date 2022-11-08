import React from 'react';
import { useState } from 'react';
import { updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { CiPaperplane } from 'react-icons/ci';
import './CommentInput.css';
function CommentInput({
  curMarkerDoc,
  setIsCommentSubmited,
  userId,
  isCommentSubmited,
}) {
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCommentSubmited) setIsCommentSubmited(false);
    await updateDoc(curMarkerDoc, {
      comments: arrayUnion({ value, userId }),
    });
    setIsCommentSubmited(true);
    setValue('');
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
    </form>
  );
}

export default CommentInput;
