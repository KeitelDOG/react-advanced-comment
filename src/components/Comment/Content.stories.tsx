import React, { MouseEventHandler } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Content from './Content';
import users from '../../data/users';
import { formatContent, defaultMentionRegex, defaultParseMention } from '../CommentInput/helper';
import ShowMoreText from './ShowMoreText';
// import customCSSModule from './CommentCustom.module.css';

export default {
  title: 'React Advanced Comment/Content',
  component: Content,
  tags: ['autodocs'],
};

const Template: StoryFn<typeof Content> = (args) => {
  return (
    <div style={{ padding: 10, border: '1px dashed #ddd', maxWidth: 480 }}>
      <ShowMoreText numberOfLines={4} expanded={false}
        // renderShowMore={<span style={{color: 'blue'}}>Expand</span>}
      >
        <Content {...args} />
      </ShowMoreText>
    </div>
  );
};

const content = 'Earum velit et ut veniam {{3}} accusantium ea excepturi modi quidem. Sapiente eum repudiandae iste ut sed et et quis illo. A consequatur esse et. Tempore atque neque 🤷 est. Sapiente explicabo rerum dolorem. Natus 😢 minima doloribus voluptas. Nihil aspernatur mollitia et voluptates reprehenderit dolorem quibusdam aliquid culpa.\nOfficia eum et et molestiae accusantium suscipit itaque aliquam id. Omnis ea quis. Eum tempora nisi qui illo in aliquid exercitationem quaerat nostrum.';

// const content = 'Earum velit et ut veniam {{3}} accusantium ea excepturi modi quidem. Tempore atque neque 🤷 est.';

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
