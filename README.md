## react-advanced-comment
A React library for commenting with advanced comment with contenteditable div mechanism, that supports mentions and emoji interactions.

<img width="480" alt="EmojiMart" src="https://github.com/KeitelDOG/react-advanced-comment/assets/14042152/419ab8f9-9b01-4906-b893-f526b609ac30">

<a href="https://keiteldog.github.io/react-advanced-comment/">Demo & Playground</a>

### Features
- Comment Input
  - Core Input
- Mentions
- Emoji Picker

Each feature has multiple components that you can use and combine on their own.

**NB: The Comment Input uses a Core Input component internally. And it can integrate existing Mentions and Emoji Picker features on rendering, so that you can integrate your own Mentions selector and Emoji Picker.**

### 📖 Table of Contents
- [🔑 Installation](#-installation)
- [💬 Comment Input](#-comment-input)
- [🗣️ Mentions](#-mentions)
- [😀 Emoji Picker](#-emoji-picker)
- [🔬 Core Input](#-core-input)


#### 🔑 Installation
```bash
npm install @keiteldog/advanced-comment-input
```
or
```bash
yarn add @keiteldog/advanced-comment-input
```

#### 💬 Comment Input
You can use Comment Input with or without using Emoji Picker and Mentions selector. If you don't pass the props to render them, the Emoticon and At icons will not be there.

```jsx
import {
  CommentInput,
  EmojiPicker,
  Mentions,
  UserAvatar,
} from '@keiteldog/react-advanced-comment';
import emojis from '@keiteldog/react-advanced-comment/dist/json/emoji-datasource-light.json';

export default function CommentInputTest(props) {
  // User type is : { id: number | string, name: string, image: string }
  const auth = { id: 1, name: 'User 1', image: '/image-1-path.jpg' };

  const usersData = [
    { id: 2, name: 'User 2', image: '/image-2-path.jpg' },
    { id: 3, name: 'User 3', image: '/image-3-path.jpg' },
    { id: 4, name: 'User 4', image: '/image-4-path.jpg' },
  ];

  return (
    <CommentInput
      // ensure that users is not empty array
      // use a key to renrender if necessary
      users={usersData}
      minLength={1}
      maxLength={256}
      showCounterAt={50}
      blockInputOnMaxLength={false}
      mentionsLimit={2}
      renderAvatar={<UserAvatar user={auth} size={32} />}
      renderMentions={({ users, onMentionSelected, onClose }) => (
        <Mentions
          users={users}
          onClose={onClose}
          onMentionSelected={onMentionSelected}
        />
      )}
      renderEmojiPicker={({ onEmojiSelected, onClose }) => (
        <EmojiPicker
          emojis={emojis}
          height={280}
          numColumns={8}
          initialCategory="emotion"
          onClose={onClose}
          onEmojiSelected={onEmojiSelected}
        />
      )}
      renderMentionsInDefaultPosition={true}
      renderEmojiPickerInDefaultPosition={true}
      onEmojiOpen={() => console.log('emoji opened')}
      onEmojiClose={() => console.log('emoji closed')}
      onMentionsOpen={() => console.log('mentions opened')}
      onSend={content => {
        console.log('comment content', content);
      }}
    />
  );
}
```
<img width="360" alt="Comment Input" src="https://github.com/KeitelDOG/react-advanced-comment/assets/14042152/91a9b9bc-7e01-488f-8c73-033cda8b3872">

For all Props, see direct link for Comment Input Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-commentinput--docs

#### 🗣️ Mentions
Mentions component provide very simple user list to display while typing or when clicking the @ icon and then chose.

<img width="360" alt="Comment Input" src="https://github.com/KeitelDOG/react-advanced-comment/assets/14042152/62965e1d-e9e9-4cb6-9f49-8b1acdd1eeac">

For all Props, see direct link for Mentions Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-mentions--docs

You can pass your own Mentions implementation like this:

```jsx
// onClose callback is not necessary since @ icon can open and close it.
// when you chose the user, you can close it too.
<CommentInput
  //...
  renderMentions={({ users, onMentionSelected, onClose }) => (
    <div>
      <img onClick={onClose} src="http://localhost/close.svg"/>
      {users.map(u => (
        <div
          key={`mention-${u.id}`}
          onClick={() => {
            onMentionSelected(u.id);
            onClose();
          }}
        >
          <img src={u.image} />
          <span>{u.name}</span>
        </div>
      ))}
    </div>
  )}
/>
```

#### 😀 Emoji Picker
The Emoji Picker component is very basic. We recommend you to use and integrate a more advance Emoji Picker like https://www.npmjs.com/package/emoji-mart. We gave an example below on how to use it.

However, if you consider evaluating the default EmojiPicker, here is more details about it:
- A light Datasource is provided, 1584 emojis : `255 KB`
- No Skin color selection implemented
- Limited to version 12.
- The datasource JSON file must be provided, you can use existing one, or provide your own, creating from Emoji Data Sources like: https://www.jsdelivr.com/package/npm/emoji-datasource or similar.

If you provide your own Emoji source, bigger or smaller they have to match the Type:
```ts
type Emoji = {
  name: string,
  unified: string,
  short_name: string,
  short_names: string[],
  category: string,
  sort_order: number,
  added_in: string,
  [key: string]: any,
};

// example:
const emojis: Emoji[] = [
  {
    name: 'DOG FACE',
    unified: '1F436',
    short_name: 'dog',
    short_names: ['dog'],
    category: 'Animals & Nature',
    sort_order: 534,
    added_in: '0.6',
  },
];
```

<img width="360" alt="Comment Input" src="https://github.com/KeitelDOG/react-advanced-comment/assets/14042152/94ee78bc-f289-4c34-95b8-2167d1cc21ad">

For all Props, see direct link for Emoji Picker Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-emojipicker--docs

If you want to use Emoji Mart, here is an example:

```jsx
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

//...

<CommentInput
  //...
  renderEmojiPicker={({ onEmojiSelected, onClose }) => (
    <Picker
      data={data}
      onEmojiSelect={emoji => onEmojiSelected(emoji.native)}
      dynamicWidth={true}
      emojiSize={28}
    />
  )}
/>
```

#### 🔬 Core Input


For all Props, see direct link for Core Input Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-coreinput--docs