import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import EmojiPicker from './EmojiPicker';
import emojis from '../../json/emoji-datasource-light.json';
// import styles from './Custom.module.css';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/EmojiPicker',
  component: EmojiPicker,
} as Meta<typeof EmojiPicker>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof EmojiPicker> = (args) => <EmojiPicker {...args} />;

export const UserEmojiPicker = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
UserEmojiPicker.args = {
  emojis,
  initialCategory: 'emotion',
  height: 280,
  numColumns: 8,
  onEmojiSelected: (emojiChar: string) => console.log('emoji selected', emojiChar),
  onClose: () => console.log('closed'),
};
