import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Mentions from './Mentions';
import { User } from './Mentions';
import users from '../../data/users';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/Mentions',
  component: Mentions,
  tags: ['autodocs'],
} as Meta<typeof Mentions>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Mentions> = (args) => <Mentions {...args} />;

export const UserMentions = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
UserMentions.args = {
  users: users.slice(1),
  onClose: () => console.log('mentions closed'),
  onMentionSelected: (user: User) => console.log('mention selected', user),
};
