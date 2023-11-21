import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CommentInput from './CommentInput';
import Avatar from '../Avatar';
import EmojiPicker from '../Emoji';
import Mentions from '../Mentions';
import { RenderMentionsProps, RenderEmojiPickerProps } from './CommentInput';
import emojis from '../../json/emoji-datasource-light.json';

import keitelPic from '../../pics/keitel.jpg';
import julioPic from '../../pics/julio.jpg';
import jetroPic from '../../pics/jetro.jpg';
import djasonPic from '../../pics/djason.jpg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/CommentInput',
  component: CommentInput,
  tags: ['autodocs'],
} as Meta<typeof CommentInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof CommentInput> = (args) => {
  return (
    <div style={{ marginTop: 200, maxWidth: 400 }}>
      <CommentInput {...args} />
    </div>
  );
};

const users = [
  { id: 1, name: 'Keitel Jovin', image: keitelPic },
  { id: 2, name: 'KeitelDOG', image: keitelPic },
  { id: 3, name: 'Julio Fils', image: julioPic },
  { id: 4, name: 'Jetro Joseph', image: jetroPic },
  { id: 5, name: 'Djason Sylvaince', image: djasonPic },
];

const initialValue = `Hello {{2}} well said 😃.

Hi {{3}} I agree with that too 👍 brother.`;

export const MainCommentInput = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainCommentInput.args = {
  auth: users[0],
  users: users,
  minLength: 1,
  maxLength: 128,
  initialValue,
  initialMentionedUsers: [users[1], users[2]],
  showCounterAt: 30,
  blockInputOnMaxLength: false,
  mentionsLimit: 2,
  // lineColor: 'blue',
  // atIconColor: 'blue',
  // emojiIconColor: 'blue',
  // textProgressColors: { one: 'green', two: 'orange', three: 'orange', four: 'red' },
  renderAvatar: (
    <Avatar user={users[0]} size={32} />
  ),
  // renderEmojiIcon: <ToolIcon src={emojiIcon} />,
  // renderAtIcon: <ToolIcon src={atIcon} />,
  renderMentions: ({ users, onMentionSelected, onClose } : RenderMentionsProps) => (
    <Mentions
      users={users}
      onClose={onClose}
      onMentionSelected={onMentionSelected}
    />
  ),
  renderEmojiPicker: ({ onEmojiSelected, onClose } : RenderEmojiPickerProps) => (
    <EmojiPicker
      emojis={emojis}
      height={280}
      numColumns={8}
      initialCategory="emotion"
      onClose={onClose}
      onEmojiSelected={onEmojiSelected}
    />
  ),
  renderMentionsInDefaultPosition: true,
  renderEmojiPickerInDefaultPosition: true,
  onEmojiOpen: () => console.log('emoji opened'),
  onEmojiClose: () => console.log('emoji closed'),
  onMentionsOpen: () => console.log('mentions opened'),
  onSend: ((content : string) => {
    console.log('Sending comment');
    console.log('comment content', content);
  }),
};
