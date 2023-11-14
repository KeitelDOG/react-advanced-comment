import React from 'react';
import { User } from '../Mentions/index.types';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './Avatar.module.css';

export interface AvatarProps {
  user?: User,
  size?: number,
  moduleClasses?: { [key : string] : any },
}

export default function Avatar(props: AvatarProps) {
  const { user, size = 38, moduleClasses } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  if (!user) {
    return (
      <div className={classes.avatar}>
        <span className={classes.avatarLabel}>Gst</span>
      </div>
    );
  }

  let userView = (
    <div className={classes.avatar}>
      <span className={classes.avatarLabel}>{user.name[0]}</span>
    </div>
  );

  if (user.image) {
    userView = (
      <div className={classes.avatar}>
        <img
          alt={user.name}
          title={user.name}
          src={user.image}
          className={classes.avatarImage}
          style={{ height: size }}
        />
      </div>
    );
  }

  return (
    <div>
      <div title={user.name} className={classes.avatarWrapper}>
        <div title={user.name}>{userView}</div>
        <div className={classes.badgeWrapper}>
          <div className={classes.badge} ></div>
        </div>
      </div>
    </div>
  );
};
