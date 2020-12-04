import React from 'react';

import Button from '../../Button/Button';
import './Post.css';

const post = props => (
  <article className="post">
    <header className="post__header">
      <h1 className="post__title">{props.title}</h1>
      <p className="post_content">{props.content}</p>
      
    </header>
    <div className="post__actions">
    <span className="post_read"> {props.read}</span>
    
      <Button mode="flat" link={props.id}>
        View
      </Button>
      <Button mode="flat" onClick={props.onStartEdit}>
        Edit
      </Button>
      <Button mode="flat" design="danger" onClick={props.onDelete}>
        Delete
      </Button>
      
    </div>
  </article>

);

export default post;
