import React, { useState } from 'react';
import './Comments.css';
import CommentInput from './CommentInput';
import { getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import Comment from './Comment';

function Comments({ curMarkerDoc, db, userId, isLogged, userName }) {
  const [commentsData, setCommentsData] = useState([]);
  const [isCommentSubmited, setIsCommentSubmited] = useState(false);

  const getComments = async () => {
    const document = await getDoc(curMarkerDoc);
    setCommentsData(document.data().comments);
  };

  useEffect(() => {
    getComments();
  }, []);
  useEffect(() => {
    getComments();
  }, [isCommentSubmited]);

  return (
    <div className='comments-container'>
      <div className='comments'>
        {commentsData.map((comment) => (
          <Comment
            userId={comment.userId}
            value={comment.value}
            userName={userName}
          />
        ))}
      </div>
      {isLogged && (
        <CommentInput
          commentsData={commentsData}
          curMarkerDoc={curMarkerDoc}
          db={db}
          setIsCommentSubmited={setIsCommentSubmited}
          userId={userId}
        />
      )}
    </div>
  );
}

export default Comments;
