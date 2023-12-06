import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CommentInput from './CommentInput';
import Avatar from '../Avatar';
import EmojiPicker from '../Emoji';
import Mentions from '../Mentions';
// import Emotion from '../../svg/Emotion';
import { RenderMentionsProps, RenderEmojiPickerProps } from './CommentInput';
import emojis from '../../json/emoji-datasource-light.json';
import users from '../../data/users';
// import customCSSModule from './CommentInputCustom.module.css';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'React Advanced Comment/CommentInput',
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

const initialValue = `Hey {{2}} well done 😃.

I like the new App you made {{3}} 👍, pretty nice.`;

export const MainCommentInput = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainCommentInput.args = {
  users,
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
  textProgressType: 'circle',
  // AvatarComponent: (
  //   <Avatar user={users[0]} size={32} />
  // ),
  AvatarComponent: () => <Avatar user={users[0]} size={32} />,
  // EmojiIconComponent: () => <Emotion height={24} width={24} fill="red" />,
  // AtIconComponent: () => <img src={atIcon} />,
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
  /* renderSubmitButton: ({ submitDisabled }) => (
    <button disabled={submitDisabled}>Submit</button>
  ), */
  // moduleClasses: customCSSModule,
  onEmojiOpen: () => console.log('emoji opened'),
  onEmojiClose: () => console.log('emoji closed'),
  onMentionsOpen: () => console.log('mentions opened'),
  onSend: ((content : string) => {
    console.log('Sending comment');
    console.log('comment content', content);
  }),
};
