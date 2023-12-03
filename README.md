## react-advanced-comment
A React library for commenting with advanced comment with contenteditable div mechanism, that supports mentions and emoji interactions.

<img width="480" alt="EmojiMart" src="https://github.com/KeitelDOG/react-advanced-comment/assets/14042152/419ab8f9-9b01-4906-b893-f526b609ac30">

<a href="https://keiteldog.github.io/react-advanced-comment/">Documentation, Demo & Playground</a> (built with Storybook)

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

######Why creating this package?

The first problem with advanced input is that you cannot insert HTML tag inside `<input>` and `<textarea>`. Some techniques allow to overlap an hidden colored mark to hightlight the `@mention` part inside `<textarea>`. We used the Content Editable DIV which combines Text Nodes and SPAN Nodes like `<div contenteditable>Hello <span>World</span></div>` which is a kind of input that allows allow HTML tag.

Using the cedit DIV, the second problem starts when you can't reassign React State value to the input without losing the Caret position and having to put it back, which makes it difficult for the traditional approach of passing state value to the div. That is because MDN and Broswers use their own engine to structure the input in cedit DIV which can strange sometimes. And this package uses a Core Input component to control and limit unwanted behavior of Browsers while texting.

###### How to use it?
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

###### Editing

If you want to edit a Comment, pass and initial value with initial mentioned Users if there is any mention.

```jsx
  const comment = 'Hello {{2}} and {{3}}';
  return (
    <CommentInput
      users={usersData}
      minLength={1}
      maxLength={245}
      initialValue={comment}
      initialMentionedUsers={[usersData[0], usersData[1]]}
      // ...
    />
  );
```

For all Props, see direct link for Comment Input Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-commentinput--docs

###### CommentInput Props
|Name|Description|Default|
|:----|:----|:----|
|auth|authenticated user info if anyUser|-|
|users|Array of users to match against @ mention and filter while typing.User[]|[]|
|minLength|Minimum characters allowing to validate the input.number|1|
|maxLength|Maximum characters allowing to validate and block the input. 0 for no limit.number|0|
|initialValue|Pass an initial text value in the input to be displayed. Useful if User want to Edit a comment.string|-|
|initialMentionedUsers|Initial list of Users mentioned in the initial value. Only use with initialValue prop if it contains Users.User[]|[]|
|showCounterAt|Start showing Countdown counter from and below a certain number (including)number|30|
|blockInputOnMaxLength|Block input from receiving new character when maxLength is reachedboolean|-|
|mentionsLimit|How many users can be mentioned in the comments. 0 is for no limit.number|2|
|textProgressType|Provide how to display the text Progress, circle or bar."circle""bar"|bar|
|AvatarComponent|Component for Authenticated User Avatar in needed.(() =&gt; Element)|-|
|renderMentions|Render the User mention list if needed. You can use internal Mentions component, or use your own component. Usage:&lt;CommentInput  renderMentions={({ users, onMentionSelected, onClose }) =&gt; (    &lt;Mentions      users={users}      onClose={onClose}      onMentionSelected={onMentionSelected}    /&gt;  )}/&gt;((props: RenderMentionsProps) =&gt; ReactNode)|-|
|renderEmojiPicker|Render the EmojiPicker if needed. You can use internal EmojiPicker component, or use your own component. Usage:&lt;CommentInput  renderEmojiPicker={({ onEmojiSelected, onClose }) =&gt; (    &lt;EmojiPicker      emojis={emojis}      height={280}      numColumns={8}      initialCategory="emotion"      onClose={onClose}      onEmojiSelected={onEmojiSelected}    /&gt;  )}/&gt;((props: RenderEmojiPickerProps) =&gt; ReactNode)|-|
|renderMentionsInDefaultPosition|Render the Mentions list at default position, which is absolute on top. If not you will provide your own custom styles to display itboolean|-|
|renderEmojiPickerInDefaultPosition|Render the Picker list at default position, at bottom. If not you will provide your own custom styles to display itboolean|-|
|onEmojiOpen|Callback when the Emoji Picker is open(() =&gt; void)|-|
|onEmojiClose|Callback when the Emoji Picker is close(() =&gt; void)|-|
|onMentionsOpen|Callback when the Mentions list is open(() =&gt; void)|-|
|onSend*|Callback on sending the Content back to parent(content: string) =&gt; void|-|
|lineColor|Bottom line color for personalisation to match your Application theme.string|#ccc in css|
|tagColor|Color to highlight the tag for mentioned users.string|#358856|
|moduleClasses|A Class Module to provide to override some classes of the default Class Modules.{ [key: string]: any; }|css module|
|mentionParseRegex|When passing an initialValue, you can provide a regular expression to retrieve the mention expressions containing the User ID if any. The regex should only match the first occurence, the algorithm will split and retrieve them recursively.N.B. A Default RegExp is already providedRegExp|'/{{[0-9]*}}/m',|
|mentionToString|Implementation to convert mention tag to unique string that identifies the user in the comment.N.B. A Default Implementation is already provided.It is important to transform each tag in string to make the counting in total text length. For example, if User(10) is Keitel Jovin:&lt;div&gt;Hello &lt;span data-id="10"&gt;Keitel Jovin&lt;/span&gt; will be transfom to "Hello {{10}}". with mentionToString(10); // =&gt; {{10}}And "Hello {{10}}" will be only 12 chars, instead of 18 chars in "Hello Keitel Jovin" provided by the HTML Div input. An example of algorithm:mentionToString = (id: number \|string) : string =&gt; { return `{{${id}}}`;}((id: string \|number) =&gt; string)|-|
|parseMentionId|Implementation to parse the mention string to ID value.N.B. A Default Implementation is already provided.When editing, an initial value can be passed. If that value contains mentions, like: Hello {{10}} and {{747}}.You provide a regex like /{{[0-9]*}}/m and a match is found: {{10}}. Now you need a function to tell the input how to retrieve the ID in it.((stringWithID: string) =&gt; string \|number)|-|
|onLengthChange|Callback on each input and change to track the length of comment outside the component((length: number) =&gt; void)|-|
|onContentChange|Callback on each input and change to track the whole content outside the component. Might be heavy if text is huge.((content: string) =&gt; void)|-|
|textProgressColors|4 colors to vary the color of the text length progression{ one: string; two: string; three: string; four: string; }|-|
|EmojiIconComponent|Render the Icon responsible to open the EmojiPicker if needed. An Icon is rendered by default.(() =&gt; Element)|-|
|AtIconComponent|Component for icon responsible to open the Mentions list if needed. An Icon is rendered by default.(() =&gt; Element)|-|
|renderSubmitButton|Render a custom Submit Button. A button is rendered by default((props: { submitDisabled: boolean; }) =&gt; ReactNode)|-|
|submitButtonText|Custom Text that should appear in Submit Button. Default: 'Send'string|-|
|submitButtonColor|Custom Color of the Submit Button. Default: some green colorstring|-|
|forceDisableSubmitButton|Should the submit button be disabled no matter what?boolean|-|
|atIconColor|Color of icon that open the Mentions liststring|-|
|emojiIconColor|Color of icon that open the Mentions liststring|-|
|onMentionsClose|Callback when the Mentions list is close(() =&gt; void)|-|


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

###### Lazy Loading (Ex: NextJS)
We also recommend to use Lazy loading to separate Emoji Picker code chunk from main bundle. With NextJS it will be like:

```jsx
import dynamic from 'next/dynamic';

const DynamicEmojiPicker = dynamic(() => import('EmojiPickerComponent'), {
  ssr: false,
  loading: () => <span>loading</span>,
});
```

And `EmojiPickerComponent` would be a component file that import the wanter Emoji Picker and the Emoji Data that you want.

#### 🔬 Core Input

The Core Input controls the behaviors of the input and keep things together and as stable as possible when inserting Emoji and Mention tags. You can use it like:

```jsx
import React from 'react';
import { CoreInput } from '@keiteldog/react-advanced-comment';

export default function CustomCommentInput() {
  const [textLength, setTexLength] = React.useState(0);
  const [emoji, setEmoji] = React.useState();
  const [mentionedUser, setMentionedUser] = React.useState();

  // 0 for infinite
  const maxLength = 256;

  return (
    <div>
      <div><span>Text length remained: {maxLength - textLength}</div>
      <CoreInput
        users={usersData}
        minLength={1}
        // 0 for not blocking input when maxLength is reached
        maxLength={0}
        // initial values for edit
        // initialValue={}
        // initialMentionedUsers={initialMentionedUsers}
        mentionsLimit={mentionsLimit}
        lineColor="green"
        tagColor="green"
        // regex, parse and to string to customize mention tags conversion to string. See Docs
        // mentionParseRegex=\RegEx\
        // mentionToString={() => {}}
        // parseMentionId={() => {}}
        emoji={emoji}
        mentionedUser={mentionedUser}
        onEmojiSet={() => setEmoji(undefined)}
        onMentionedUserSet={() => setMentionedUser(undefined)}
        onMentionMatch={(usrs: User[]) => {
          // while typing: Hello @use
          setMentionUsers(usrs);
        }}
        onMentionedUsersUpdate={(ids: number[]) => {
          // to track list of user that has been mentioned if necessary to hide the Mentions selector
          setMentionedIds(ids);
        }}
        //
        onValidationChange={(val: boolean) => {
          if (val) {
            console.log('enable submit button');
          } else {
            console.log('disable submit button');
          }
        }}
        onLengthChange={(length: number) => {
          setTextLength(length);
        }}
        onContentChange={(cnt: string) => {
          console.log('content change', cnt);
        }}
        sending={sending}
        onSend={(cnt: string) => {
          setSending(false);
          onSend(cnt);
        }}
      />
      <div><span onClick={() => setEmoji('🐶')}>Click to add 🐶 Emoji</span></div>
      <div><span onClick={() => setMentionedUser(usersData[0])}>Click to mention User 2</span></div>
      <div><span onClick={() => setSending(true)}>Click to send</span></div>
    </div>
  );
}
```

For all Props, see direct link for Core Input Documentation: https://keiteldog.github.io/react-advanced-comment/path=/docs/react-advanced-comment-coreinput--docs