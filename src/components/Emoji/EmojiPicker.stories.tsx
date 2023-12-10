import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import EmojiPickerComp from './EmojiPicker';
import emojis from '../../json/emoji-datasource-light.json';
import Emoticon from '../../svg/Emoticon';
// import styles from './Custom.module.css';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'React Advanced Comment/EmojiPicker',
  component: EmojiPickerComp,
  tags: ['autodocs'],
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof EmojiPickerComp> = (args) => <EmojiPickerComp {...args} />;

export const EmojiPicker: Meta<typeof EmojiPickerComp> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
EmojiPicker.args = {
  emojis,
  initialCategory: 'emotion',
  // renderClose: false,
  /* categoryIcons: {
    emotion: () => <Emoticon height={18} width={18} color="blue" />,
  }, */
  height: 280,
  numColumns: 8,
  onEmojiSelected: (emojiChar: string) => console.log('emoji selected', emojiChar),
  onClose: () => console.log('closed'),
};
