import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import CoreInput from './CoreInput';
import { User } from '../Mentions/index.types';
import keitelPic from '../../pics/keitel.jpg';
import julioPic from '../../pics/julio.jpg';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/CoreInput',
  component: CoreInput,
  tags: ['autodocs']
} as Meta<typeof CoreInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof CoreInput> = (args) => {
  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <CoreInput {...args} />
    </div>
  );
};

const users = [
  { id: 1, name: 'KeitelDOG', image: keitelPic },
  { id: 2, name: 'Julio Fils', image: julioPic },
];

export const MainCoreInput = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
MainCoreInput.args = {
  users,
  mentionsLimit: 2,
  onEmojiSet: () => { console.log('emoji set') },
  onMentionedUserSet: () => { console.log('mentioned user set') },
  onMentionMatch: (users: User[]) => { console.log('mention matched', users) },
  onValidationChange: (isValid: boolean) => console.log('validated?', isValid),
};
