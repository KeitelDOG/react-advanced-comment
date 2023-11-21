import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Mentions from './Mentions';
import { User } from './Mentions';

import keitelPic from '../../pics/keitel.jpg';
import julioPic from '../../pics/julio.jpg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/Mentions',
  component: Mentions,
} as Meta<typeof Mentions>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Mentions> = (args) => <Mentions {...args} />;

const users = [
  { id: 1, name: 'Keitel Jovin', image: keitelPic },
  { id: 2, name: 'Julio Fils', image: julioPic },
];

export const UserMentions = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
UserMentions.args = {
  users,
  onClose: () => console.log('mentions closed'),
  onMentionSelected: (user: User) => console.log('mention selected', user),
};