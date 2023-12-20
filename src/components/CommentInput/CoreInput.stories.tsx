import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CoreInput from './CoreInput';
import { User } from '../Mentions/Mentions';
import users from '../../data/users';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'React Advanced Comment/Input/CoreInput',
  component: CoreInput,
  tags: ['autodocs']
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof CoreInput> = (args) => {
  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <CoreInput {...args} />
    </div>
  );
};

export const MainCoreInput: Meta<typeof CoreInput> = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainCoreInput.args = {
  users: users.slice(1),
  mentionsLimit: 2,
  placeholder: 'Give your opinion',
  onEmojiSet: () => { console.log('emoji set') },
  onMentionedUserSet: () => { console.log('mentioned user set') },
  onMentionMatch: (users: User[]) => { console.log('mention matched', users) },
  onValidationChange: (isValid: boolean) => console.log('validated?', isValid),
};
