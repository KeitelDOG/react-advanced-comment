import React from 'react';
import Close from '../../svg/Close';
import defaultClasses from './Mentions.module.css';
import { combineClasses } from '../helpers/combineClasses';
import { User, MentionsProps } from './index.types';

export default function Mentions(props : MentionsProps) {
  const { users, renderCloseIcon, onClose, onMentionSelected, moduleClasses } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  const handleMentionSelected = (user : User) => {
    if (typeof onMentionSelected === 'function') {
      onMentionSelected(user);
    }
  };

  return (
    <div className={classes.mentions}>
      <div className={classes.container}></div>
      <div className={classes.header}>
        <div className={classes.closeIcon} onClick={onClose}>
          {renderCloseIcon ? (
            renderCloseIcon
          ) : (
            <Close height={18} with={18} color="#aaa"/>
          )}
        </div>
      </div>
      <div className={classes.usersContainer}>
        {users.map((user, ind) => {
          return (
            <div
              key={`tag-user-${ind}`}
              className={classes.user}
              onClick={() => handleMentionSelected(user)}
            >
              <img
                alt={user.name}
                src={user.image}
                className={classes.mentionPhoto}
              />
              <span className={classes.mentionText}>{user.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
