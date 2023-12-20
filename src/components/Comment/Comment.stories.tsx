import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Comment from './Comment';
import users from '../../data/users';
import Avatar from '../Avatar';
import Like from '../../svg/Like';

export default {
  title: 'React Advanced Comment/Comment/Comment',
  component: Comment,
  tags: ['autodocs'],
};

const Template: StoryFn<typeof Comment> = (args) => {
  return (
    <div style={{ padding: 10, maxWidth: 480, fontFamily: 'Nunito Sans' }}>
      <div>
        <Comment
          {...args}
          renderFooter={
            <footer style={{ marginTop: 16, display: 'flex' }}>
              <div
                style={{ display: 'flex', position: 'relative', cursor: 'pointer' }}
                onClick={() => console.log('like clicked')}
              >
                <Like
                  height={22}
                  width={22}
                  fill="transparent"
                  rectFill="#30694b"
                  stroke="#30694b"
                />
                <span style={{ fontSize: 13, position: 'absolute', left: '120%', top: -7, color: '#555' }}>2.1K</span>
              </div>

              <div
                style={{ marginLeft: 50, display: 'flex', position: 'relative', cursor: 'pointer' }}
                onClick={() => console.log('dislike clicked')}
              >
                <Like
                  style={{ transform: 'rotate(180deg)' }}
                  height={22}
                  width={22}
                  fill="transparent"
                  rectFill="#b81417"
                  stroke="#b81417"
                />
                <span style={{ fontSize: 13, position: 'absolute', left: '120%', top: -7, color: '#555' }}>41</span>
              </div>
            </footer>
          }
        />
      </div>
    </div>
  );
};

const content = 'Earum velit et ut veniam {{3}} accusantium ea excepturi modi quidem. Sapiente eum repudiandae iste ut sed et et quis illo. A consequatur esse et. Tempore atque neque 🤷 est. Sapiente explicabo rerum dolorem. Natus 😢 minima doloribus voluptas. Nihil aspernatur mollitia et voluptates reprehenderit dolorem quibusdam aliquid culpa.\nOfficia eum et et molestiae accusantium suscipit itaque aliquam id. Omnis ea quis. Eum tempora nisi qui illo in aliquid exercitationem quaerat nostrum.';

export const MainComment: Meta<typeof Comment> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainComment.args = {
  content,
  user: users[0],
  mentionedUsers: [users[2]],
  // date: '2023-12-16 12:30:00',
  timeAgoProps: { date: '2023-12-16 12:30:00', minPeriod: 60 },
  AvatarComponent: () => <Avatar user={users[0]} size={32} />,
  /* MentionComponent: ({ user }) => {
    return <span style={{ color: 'green' }}>{user.name}</span>;
  }, */
};
