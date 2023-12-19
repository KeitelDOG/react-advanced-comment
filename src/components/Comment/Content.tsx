import React, { ReactNode } from 'react';
import { defaultMentionRegex, defaultParseMention, formatContent } from '../CommentInput/helper';
import { ContentPart } from '../CommentInput/CoreInput';
import { User } from '../Mentions/Mentions';
import defaultClasses from './Content.module.css';
import { combineClasses } from '../helpers/combineClasses';
import { ParseMentionProps } from '../CommentInput/CoreInput';

export type ContentProps = ParseMentionProps & {
  /** Content to display in the comment component */
  content: string | ContentPart[],

  /** Provide mentioned Users if the comment contains mention. Only for string comment.
   * @default []
   */
  mentionedUsers?: User[],

  /** A Class Module to provide to override some classes of the default Class Modules.
   *  classes: `content, mention`
   * @default css module
  */
  moduleClasses?: { [key : string] : any },

  /** Provide a Component that accept a User prop to render the mentioned User. A default is used inside this component. */
  MentionComponent?: (props: { user: User, [key: string]: any }) => React.JSX.Element,
};

export default function CommentContent(props : ContentProps) {
  const {
    content,
    mentionedUsers = [],
    mentionParseRegex = defaultMentionRegex,
    parseMentionId = defaultParseMention,
    moduleClasses,
    MentionComponent
  } = props;

  const classes = combineClasses(defaultClasses, moduleClasses);

  const contents : ReactNode = React.useMemo(() => {
    let parts: ContentPart[] = [];
    if (typeof content === 'object') {
      parts = content;
    } else {
      parts = formatContent(content, mentionedUsers, mentionParseRegex, parseMentionId);
    }

    return parts.map(({ type, data }, ind) => {
      if (type === 'mention') {
        if (MentionComponent) {
          return <MentionComponent key={`mention-${ind}`} user={data as User} />
        } else {
          return (
            <span
              key={`mention-${ind}`}
              role="mark"
              aria-label={`${(data as User).name} mentioned`}
              className={classes.mention}
            >
              {(data as User).name}
            </span>
          );
        }
      } else if (type === 'newline') {
        return <br key={`mention-${ind}`}/>;
      }

      return data as string;
    });
  }, [content]);

  return (
    <p role="paragraph" className={classes.content}>
      {contents}
    </p>
  );
}
