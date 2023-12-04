import React from 'react';
import Avatar from '../Avatar/Avatar';
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

  /** A Class Module to provide to override some classes of the default Class Modules.
   * classes: `mentions, header, closeIcon, usersContainer, user, mentionText`
   * @default css module
  */
  moduleClasses?: { [key : string] : any }
};

export default function Mentions(props : MentionsProps) {
  const { users, renderCloseIcon, onClose, onMentionSelected, moduleClasses } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  const handleMentionSelected = (user : User) => {
    onMentionSelected(user.id);
  };

  return (
    <div data-class="mentions" className={classes.mentions}>
      <div data-class="header" className={classes.header}>
        <div data-class="closeIcon" className={classes.closeIcon} onClick={onClose}>
          {renderCloseIcon ? (
            renderCloseIcon
          ) : (
            <Close height={18} with={18} color="#aaa"/>
          )}
        </div>
      </div>

      <ul
        aria-label="Users to mention"
        data-class="usersContainer"
        className={classes.usersContainer}
      >
        {users.map((user, ind) => {
          return (
            <li
              key={`tag-user-${ind}`}
              aria-label={`select ${user.name}`}
              data-class="user"
              className={classes.user}
              onClick={() => handleMentionSelected(user)}
            >
              {user.image && (
                <Avatar user={user} size={32} />
              )}
              <span data-class="mentionText" className={classes.mentionText}>{user.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
