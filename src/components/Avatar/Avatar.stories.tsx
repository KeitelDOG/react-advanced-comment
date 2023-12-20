import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Avatar from './Avatar';
import users from '../../data/users';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'React Advanced Comment/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />;

export const MainAvatar: Meta<typeof Avatar> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainAvatar.args = {
  user: users[1],
  guestName: 'Gst',
  size: 38,
  showBadge: true,
  badgeColor: '#358856',
};
