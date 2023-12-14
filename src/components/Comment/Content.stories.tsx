import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Content from './Content';
import users from '../../data/users';
import { formatContent, defaultMentionRegex, defaultParseMention} from '../CommentInput/helper';
// import customCSSModule from './CommentCustom.module.css';

export default {
  title: 'React Advanced Comment/Content',
  component: Content,
  tags: ['autodocs'],
};

const Template: StoryFn<typeof Content> = (args) => {
  return (
    <div style={{ padding: 10, border: '1px dashed #ddd', maxWidth: 320 }}>
      <Content {...args} />
    </div>
  );
};

const content = 'Hey {{2}} well done 😃.\n\nI like the new App you made {{3}} 👍, pretty nice.';

const parts = formatContent(
  content,
  users,
  defaultMentionRegex,
  defaultParseMention,
);

export const MainContent: Meta<typeof Content> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainContent.args = {
  content: parts,
  /* MentionComponent: ({ user }) => {
    return <span style={{ color: 'green' }}>{user.name}</span>;
  }, */
};
