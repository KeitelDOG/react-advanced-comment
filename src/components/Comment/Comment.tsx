import React from 'react';
import { defaultMentionRegex, defaultParseMention } from '../CommentInput/helper';
import { ContentPart } from '../CommentInput/CoreInput';
import { User } from '../Mentions/Mentions';
import Content from './Content';
import ShowMoreText from './ShowMoreText';
import defaultClasses from './Comment.module.css';
import { combineClasses } from '../helpers/combineClasses';
import { ParseMentionProps } from '../CommentInput/CoreInput';
import { ReactTimeagoProps } from 'react-timeago';

import CommentHeader from './Header';

export type CommentProps = ParseMentionProps & {
  /** User that made the comment */
  user: User,

  /** Comment to display in the comment component */
  content: string | ContentPart[],

  /** Provide mentioned Users if the comment contains mention. Only for string comment.
   * @default []
   */
  mentionedUsers?: User[],

  /** Date of the comment to display. If not using Time Ago props, the use the date as a string. */
  date?: string,

  /** Pass React Time Ago props to ReactTimeago package used internally in this component. Prop date take precendence on timeago. */
  timeAgoProps?: ReactTimeagoProps,

  /** A Class Module to provide to override some classes of the default Class Modules.
   *  classes: `commentWrapper,contentSection`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },

  /** Component for Authenticated User Avatar if needed. */
  AvatarComponent: () => React.JSX.Element,

  /** Provide a Component that accept a User prop to render the mentioned User. A default is used inside this component. */
  MentionComponent?: (props: { user: User, [key: string]: any }) => React.JSX.Element,

  /** Render a custom footer while waiting for a CommentFooter or CommentActions component feature soon. */
  renderFooter?: React.ReactNode,
};

export default function Comment(props : CommentProps) {
  const {
    user,
    content,
    mentionedUsers = [],
    date,
    timeAgoProps = {} as ReactTimeagoProps,
    mentionParseRegex = defaultMentionRegex,
    parseMentionId = defaultParseMention,
    moduleClasses,
    AvatarComponent,
    MentionComponent,
    renderFooter
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  return (
    <section data-class="commentWrapper" className={classes.commentWrapper}>
      <CommentHeader
        user={user}
        AvatarComponent={AvatarComponent}
        date={date}
        timeAgoProps={timeAgoProps}
      />
      <div data-class="contentSection" className={classes.contentSection}>
        <ShowMoreText
          numberOfLines={4}
          expanded={false}
        >
          <Content
            content={content}
            mentionedUsers={mentionedUsers}
            mentionParseRegex={mentionParseRegex}
            parseMentionId={parseMentionId}
            MentionComponent={MentionComponent}
          />
        </ShowMoreText>
      </div>

      {renderFooter}
    </section>
  );
}
