import React from 'react';
import Close from '../../svg/Close';
import defaultClasses from './Mentions.module.css';
import { combineClasses } from '../helpers/combineClasses';

export type User = {
  id: number | string,
  name: string,
  image?: string,
};

export type MentionsProps = {
  users: User[],
  renderCloseIcon?: React.ReactNode,
  onClose?() : void,
  /** Callback with User id when a User is mentioned */
  onMentionSelected(id: number | string) : void,
  moduleClasses?: { [key : string] : any }
};


export default function Mentions(props : MentionsProps) {
  const { users, renderCloseIcon, onClose, onMentionSelected, moduleClasses } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  const handleMentionSelected = (user : User) => {
    if (typeof onMentionSelected === 'function') {
      onMentionSelected(user.id);
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
      <ul aria-label="Users to mention" className={classes.usersContainer}>
        {users.map((user, ind) => {
          return (
            <li
              key={`tag-user-${ind}`}
              aria-label={`select ${user.name}`}
              className={classes.user}
              onClick={() => handleMentionSelected(user)}
            >
              <img
                alt={user.name}
                src={user.image}
                className={classes.mentionPhoto}
              />
              <span className={classes.mentionText}>{user.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
