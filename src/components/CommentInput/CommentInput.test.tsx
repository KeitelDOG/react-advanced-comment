import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CommentInput, { CommentInputProps } from './CommentInput';
import usersData from '../../data/users';

describe('CommentInput', () => {
  const comment = 'Hey {{2}} well done 😃.\n\nI like the new App you made {{3}} 👍, pretty nice.';

  const spyEmojiOpen = jest.fn();
  const spyEmojiClose = jest.fn();
  const spyMentionsOpen = jest.fn();
  const spyMentionsClose = jest.fn();
  const spyContentChange = jest.fn();
  const spySend = jest.fn();

  const users = usersData.slice(1);
  const props = {
    users,
    minLength: 2,
    maxLength: 0,
    // initialValue: '',
    // initialMentionedUsers: [],
    showCounterAt: 30,
    // textProgressColors: {},
    blockInputOnMaxLength: false,
    mentionsLimit: 2,
    // renderMentions: null,
    // renderEmojiPicker: null ,
    renderMentionsInDefaultPosition: true,
    renderEmojiPickerInDefaultPosition: true,
    // AvatarComponent: null,
    // EmojiIconComponent: null,
    // AtIconComponent: null,
    // renderSubmitButton: null,
    submitButtonText: 'Soumettre',
    submitButtonColor: 'green',
    forceDisableSubmitButton: false,
    lineColor: 'blue',
    tagColor: 'green',
    atIconColor: 'brown',
    emojiIconColor: 'orange',
    // moduleClasses: null,
    // mentionParseRegex: /{{[0-9]*}}/m,
    // mentionToString: : () => {},
    // parseMentionId: () => {},
    onEmojiOpen: spyEmojiOpen,
    onEmojiClose: spyEmojiClose,
    onMentionsOpen: spyMentionsOpen,
    onMentionsClose: spyMentionsClose,
    onContentChange: spyContentChange,
    onSend: spySend
  } as CommentInputProps;

  const EmojiPicker = ({ onEmojiSelected, onClose }) => (
    <section
      role="section"
      aria-label="Emoji Picker"
      onClick={() => {
        onEmojiSelected('🇭🇹');
        onClose();
      }}
    >
      Click to Select emoji 🇭🇹
    </section>
  );

  const Mentions = ({ users: usrs, onMentionSelected, onClose }) => (
    <section
      role="section"
      aria-label="Mentions"
      onClick={() => {
        onMentionSelected(usrs[0].id);
        onClose();
      }}
    >
      Click to mention KeitelDOG
    </section>
  );

  test('should render global input design with custom classes', () => {
    render(
      <CommentInput
        {...props}
        moduleClasses={{ inputWrapper: 'hashclass' }}
        renderEmojiPicker={EmojiPicker}
        renderMentions={Mentions}
      />
    );
    // container
    const container = screen.getByTestId('comment-input-container');
    expect(container.style.borderColor).toBe('blue');
    // core input
    screen.getByRole('textbox', { name: 'advanced comment input'});

    // emoticon icon
    const emoticon = screen.getByRole('svgRoot', { name: 'emoticon'});
    expect(emoticon.getAttribute('fill')).toBe('orange');

    // at icon
    const at = screen.getByRole('svgRoot', { name: 'at'});
    const circle = at.getElementsByTagName('circle')[0];
    const path = at.getElementsByTagName('path')[0];
    expect(circle.getAttribute('stroke')).toBe('brown');
    expect(path.getAttribute('stroke')).toBe('brown');

    // submit should be disabled, grey, no cursor pointer
    const submit = screen.getByRole('button', { name: 'Soumettre' });

    expect(submit.getAttributeNames()).toContain<string>('disabled');
    expect(submit.style.backgroundColor).toBe('rgb(204, 204, 204)');
    expect(submit.style.cursor).toBe('auto');
  });

  test('should render Text progress meter when maxLength is limited', () => {
    render(<CommentInput {...props} maxLength={50} />);
    const meter = screen.getByRole('meter', { name: 'Text Progress' });
    expect(meter.getAttribute('min')).toBe('0');
    expect(meter.getAttribute('high')).toBe('80');
    expect(meter.getAttribute('max')).toBe('100');
    expect(meter.getAttribute('value')).toBe('0');
    // span should be empty with color defined
    const span = meter.getElementsByTagName('span')[0];
    expect(span.textContent).toBeFalsy();
    expect(span.style.color).toBe('rgb(53, 136, 86)');

    // add some comment to updae progress. typing length 37
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });
    const typing = 'Hello World. This is a short comment.';
    fireEvent.input(input, {
      target: { textContent: typing }
    });
    // value is 37/50 => 74/100 => 74%
    expect(meter.getAttribute('value')).toBe('74');
    // remaining characters should show up for 30 or less (50 - 37 = 13)
    expect(span.textContent).toBe('13');
  });

  test('user click emoticon icon to open Emoji Picker and select Haiti Flag', () => {
    render(
      <CommentInput
        {...props}
        renderEmojiPicker={EmojiPicker}
      />
    );
    const emoticon = screen.getByRole('svgRoot', { name: 'emoticon'});
    fireEvent.click(emoticon);
    // should callback that emoji picker was open
    expect(spyEmojiOpen).toHaveBeenCalled();

    // clicking section to choose Haiti Emoji flag and callback onClose
    const section = screen.getByRole('section', { name: 'Emoji Picker'});
    fireEvent.click(section);
    expect(spyEmojiClose).toHaveBeenCalled();
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });
    expect(input.textContent).toBe('🇭🇹');
  });

  test('user click at icon to open Mention and select KeitelDOG', () => {
    render(
      <CommentInput
        {...props}
        renderMentions={Mentions}
      />
    );
    const at = screen.getByRole('svgRoot', { name: 'at'});
    fireEvent.click(at);
    // should callback that Mentions was open
    expect(spyMentionsOpen).toHaveBeenCalled();

    // clicking section to choose KeitelDOG and callback onClose
    const section = screen.getByRole('section', { name: 'Mentions'});
    fireEvent.click(section);
    expect(spyMentionsClose).toHaveBeenCalled();

    screen.getByRole('mark', { name: `${users[0].name} mentioned`});
  });

  test('render custom Emoticon, At and Submit component', () => {
    render(
      <CommentInput
        {...props}
        maxLength={100}
        renderEmojiPicker={EmojiPicker}
        renderMentions={Mentions}
        AvatarComponent={() => (
          <img alt="Keitel Jovin" src="http://localhost/file-stub-avatar" />
        )}
        EmojiIconComponent={() => (
          <img alt="Custom Emoji Comp" src="http://localhost/file-stub-emoji" />
        )}
        AtIconComponent={() => (
          <img alt="Custom At Comp" src="http://localhost/file-stub-at" />
        )}
        renderSubmitButton={({ submitDisabled }) => (
          <button disabled={submitDisabled}>Submit</button>
        )}
      />
    );

    // Avatar, Emoji and At Component should be now <img>
    const avatar = screen.getByRole('img', { name: 'Keitel Jovin'}) as HTMLImageElement;
    const emoticon = screen.getByRole('img', { name: 'Custom Emoji Comp'}) as HTMLImageElement;
    const at = screen.getByRole('img', { name: 'Custom At Comp'}) as HTMLImageElement;

    expect(avatar.src).toBe('http://localhost/file-stub-avatar');
    expect(emoticon.src).toBe('http://localhost/file-stub-emoji');
    expect(at.src).toBe('http://localhost/file-stub-at');

    // Custom button should be rendered and be disabled
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button.getAttributeNames()).toContain('disabled');

    // add some text
    const input = screen.getByRole('textbox', { name: 'advanced comment input' });
    const typing = 'Hello World.';
    fireEvent.input(input, {
      target: { textContent: typing }
    });

    // now button should be enabled
    expect(button.getAttributeNames()).not.toContain('disabled');
  });

  test('should use custom functions and regex to convert and parse mentioned user id', async () => {
    const customComment = 'Hey [**2**] well done 😃.\n\nI like the new App you made [**3**] 👍, pretty nice.';

    const mentionToString = (id: number | string) : string => {
      return `[**${id}**]`;
    }
    const parseMentionId = (stringWithID: string) : number | string => {
      const id : string = stringWithID.slice(3, -3);
      return isNaN(parseInt(id)) ? id : Number(id);
    }
    const mentionParseRegex = /\[\*\*[0-9]*\*\*]/m;

    let content: string = '';
    render(
      <CommentInput
        {...props}
        initialValue={customComment}
        initialMentionedUsers={[users[0], users[1]]}
        onContentChange={(cnt: string) => {
          content = cnt;
        }}
        mentionToString={mentionToString}
        parseMentionId={parseMentionId}
        mentionParseRegex={mentionParseRegex}
      />
    );

    // 2 mentions should be there
    screen.getByRole('mark', { name: `${users[0].name} mentioned` });
    screen.getByRole('mark', { name: `${users[1].name} mentioned` });
  });

  test('should send message whether onContentChange is set or not', () => {
    // with onContentChange
    const { rerender } = render(<CommentInput {...props} />);

    const input = screen.getByRole('textbox', { name: 'advanced comment input' });
    const typing = 'Hello World. A comment to send.';
    fireEvent.input(input, {
      target: { textContent: typing }
    });

    const submit = screen.getByRole('button', { name: 'Soumettre' });
    fireEvent.click(submit);
    expect(spySend).toHaveBeenCalledWith(typing);

    // without onContentChange
    rerender(<CommentInput {...props} onContentChange={undefined} />);

    const typing2 = `${typing} With no onContentChange`;
    fireEvent.input(input, {
      target: { textContent:  typing2 }
    });

    fireEvent.click(submit);
    expect(spySend).toHaveBeenCalledWith(typing2);
  });

  test('should close Mention when Emoji Picker opens and close Emoji Picker when Mentions open', () => {
    // with onContentChange
    render(
      <CommentInput
        {...props}
        renderEmojiPicker={EmojiPicker}
        renderMentions={Mentions}
      />
    );
    const emoticon = screen.getByRole('svgRoot', { name: 'emoticon'});
    const at = screen.getByRole('svgRoot', { name: 'at'});

    // open emoji picker (mocked in the test)
    fireEvent.click(emoticon);
    screen.getByRole('section', { name: 'Emoji Picker'});
    const mentionsClosed = screen.queryByRole('section', { name: 'Mentions'});
    expect(mentionsClosed).toBeNull();

    // open Mentions
    fireEvent.click(at);
    screen.getByRole('section', { name: 'Mentions' });
    const emojiClosed = screen.queryByRole('section', { name: 'Emoji Picker'});
    expect(emojiClosed).toBeNull();
  });
});