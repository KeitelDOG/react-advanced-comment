import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CommentHeader from './CommentHeader';
import users from '../../data/users';
import Avatar from '../Avatar';
import Like from '../../svg/Like';

export default {
  title: 'React Advanced Comment/Comment/CommentHeader',
  component: CommentHeader,
  tags: ['autodocs'],
};

const Template: StoryFn<typeof CommentHeader> = (args) => {
  return (
    <div style={{ padding: 10, maxWidth: 480, fontFamily: 'Nunito Sans' }}>
        <CommentHeader
          {...args}
        />
        <div
          style={{
            marginTop: 10,
            padding: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            color: '#777',
            backgroundColor: '#eee',
          }}
        >Any additional content here. You can use ShowMoreText and CommentContent for example.</div>
    </div>
  );
};


export const MainCommentHeader: Meta<typeof CommentHeader> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainCommentHeader.args = {
  user: users[0],
  // date: '2023-12-16 12:30:00',
  timeAgoProps: {
    date: '2023-12-16 12:30:00',
    minPeriod: 60
  },
  AvatarComponent: () => <Avatar user={users[0]} size={32} />,
};
