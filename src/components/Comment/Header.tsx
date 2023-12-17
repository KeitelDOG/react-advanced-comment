import React from 'react';
import { User } from '../Mentions/Mentions';
import defaultClasses from './Header.module.css';
import { combineClasses } from '../helpers/combineClasses';
import ReactTimeago, { ReactTimeagoProps } from 'react-timeago';

export type CommentHeaderProps = {
  /** User that made the comment */
  user: User,

  /** Date of the comment to display. If not using Time Ago props, the use the date as a string. */
  date?: string,

  /** Pass React Time Ago props to ReactTimeago package used internally in this component. Prop date take precendence on timeago. */
  timeAgoProps?: ReactTimeagoProps,

  /** A Class Module to provide to override some classes of the default Class Modules.
   *  classes: `headerWrapper,userInfo,name,timeAgo`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },

  /** Component for Authenticated User Avatar if needed. */
  AvatarComponent: () => React.JSX.Element,
};

export default function CommentHeader(props : CommentHeaderProps) {
  const {
    user,
    date,
    timeAgoProps = {} as ReactTimeagoProps,
    moduleClasses,
    AvatarComponent,
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  return (
    <header data-class="headerWrapper" className={classes.headerWrapper}>
      <AvatarComponent />
      <div data-class="userInfo" className={classes.userInfo}>
        <span data-class="name" className={classes.name}>
          {user.name}
        </span>
        {date ? (
          <span data-class="timeAgo" className={classes.timeAgo}>{date}</span>
        ) : (
          <ReactTimeago
            component={(props) => (
              <span title={timeAgoProps.date as string} data-class="timeAgo" className={classes.timeAgo}>{props.children}</span>
            )}
            {...(timeAgoProps)}
          />
        )}
      </div>
    </header>
  );
}
