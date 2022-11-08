import React from 'react';
import './Comment.css';
function Comment({ value, userName }) {
  return (
    <div className='comment'>
      <p className='comment-text'>{value}</p>
      <h4 className='comment-user-name'>{userName}</h4>
    </div>
  );
}

export default Comment;
