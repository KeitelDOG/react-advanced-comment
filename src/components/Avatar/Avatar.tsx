import React from 'react';
import { User } from '../Mentions/Mentions';
import { combineClasses } from '../helpers/combineClasses';
import defaultClasses from './Avatar.module.css';

export interface AvatarProps {
  /** User if any to show in the Avatar */
  user?: User,

  /**
   * Guest name to show if there no use is provided. Default is used if none is provided.
   * @default Gst
    */
  guestName?: string,

  /**
   * @default 38
   */
  size?: number,

  /**
   * show colored badge at bottom right corner
   * @default true
   */
  showBadge?: boolean,

  /**
   * color of badge
   * @default green
   */
  badgeColor?: string,

  /** A Class Module to provide to override some classes of the default Class Modules.
   * classes: `avatarWrapper, avatar, avatarLabel, avatarImage, badgeWrapper, badge`
  */
  moduleClasses?: { [key : string] : any },
}

export default function Avatar(props: AvatarProps) {
  const {
    user,
    guestName = 'Gst',
    size = 38,
    showBadge = true,
    badgeColor= 'green',
    moduleClasses
  } = props;
  const classes = combineClasses(defaultClasses, moduleClasses);

  if (!user) {
    return (
      <div data-class="avatar" className={classes.avatar}>
        <span aria-label="guest avatar" data-class="avatarLabel" className={classes.avatarLabel}>{guestName}</span>
      </div>
    );
  }

  let userView = (
    <div data-class="avatar" className={classes.avatar}>
      <span  aria-label={`${user.name} avatar`} className={classes.avatarLabel}>{user.name[0]}</span>
    </div>
  );

  if (user.image) {
    userView = (
      <div data-class="avatar" className={classes.avatar}>
        <img
          alt={user.name}
          title={user.name}
          src={user.image}
          data-class="avatarImage"
          className={classes.avatarImage}
          style={{ height: size }}
        />
      </div>
    );
  }

  return (
    <div>
      <div data-class="avatarWrapper" className={classes.avatarWrapper}>
        <div title={user.name}>{userView}</div>
        {showBadge && (
          <div data-class="badgeWrapper" className={classes.badgeWrapper}>
            <div
              data-testid="avatar-badge"
              data-class="badge"
              className={classes.badge}
              style={{ backgroundColor: badgeColor }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
